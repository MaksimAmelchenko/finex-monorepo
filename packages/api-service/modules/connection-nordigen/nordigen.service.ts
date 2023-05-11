import * as NordigenClient from 'nordigen-node';
import * as uuid from 'uuid';
import type NordigenClientType from 'nordigen-node';

import config from '../../libs/config';
import {
  CashAccountType,
  ConnectionProvider,
  ProviderAccountStatus,
  IConnection,
  IProviderAccount,
} from '../connection/types';
import { ConflictError, NotFoundError } from '../../libs/errors';
import {
  CreateRequisitionServiceData,
  IAccountNordigen,
  IInstitution,
  IRequisition,
  IRequisitionNordigen,
  NordigenService,
} from './types';
import { IRequestContext } from '../../types/app';
import { connectionService } from '../connection/connection.service';
import { nordigenMapper } from './mordigen.mapper';
import { nordigenRepository } from './nordigen.repository';

const { secretId, secretKey } = config.get('nordigen');

class NordigenServiceImpl implements NordigenService {
  private secretId: string;
  private secretKey: string;
  private client: NordigenClientType;

  constructor({ secretId, secretKey }: { secretId: string; secretKey: string }) {
    this.secretId = secretId;
    this.secretKey = secretKey;
    // @ts-ignore
    this.client = new NordigenClient({ secretId, secretKey });
    this.client.generateToken().catch(err => console.error({ err }, 'Nordigen token generation error'));
  }

  async getInstitutions(ctx: IRequestContext<unknown, true>, country: string): Promise<IInstitution[]> {
    return this.client.institution.getInstitutions({ country });
  }

  async getInstitution(ctx: IRequestContext<unknown, true>, institutionId: string): Promise<IInstitution> {
    return this.client.institution.getInstitutionById(institutionId);
  }

  async createRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateRequisitionServiceData
  ): Promise<IRequisition> {
    const { institutionId, origin } = data;
    const requisitionId = uuid.v4();

    const requisitionNordigen: IRequisitionNordigen = await this.client.initSession({
      redirectUrl: `${origin}/connections/nordigen/requisitions/complete`,
      institutionId,
      referenceId: requisitionId,
    } as any);

    const requisitionDAO = await nordigenRepository.createRequisition(ctx, projectId, userId, {
      id: requisitionId,
      requisitionId: requisitionNordigen.id,
      institutionId,
      status: requisitionNordigen.status,
      responses: [requisitionNordigen],
    });

    return nordigenMapper.toRequisition(requisitionDAO);
  }

  async getRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IRequisition> {
    const requisitionDAO = await nordigenRepository.getRequisition(ctx, projectId, userId, requisitionId);
    if (!requisitionDAO) {
      throw new NotFoundError('Requisition not found');
    }
    return nordigenMapper.toRequisition(requisitionDAO);
  }

  async getRequisitionByConnectionId(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IRequisition> {
    const requisitionDAO = await nordigenRepository.getRequisitionByConnectionId(ctx, projectId, userId, connectionId);
    if (!requisitionDAO) {
      throw new NotFoundError('Requisition not found');
    }
    return nordigenMapper.toRequisition(requisitionDAO);
  }

  async completeRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IConnection> {
    const requisition = await this.getRequisition(ctx, projectId, userId, requisitionId);

    if (requisition.connectionId) {
      throw new ConflictError('Requisition already completed');
    }

    const requisitionNordigen: IRequisitionNordigen | undefined = await this.client.requisition.getRequisitionById(
      requisition.requisitionId
    );

    if (!requisitionNordigen) {
      throw new NotFoundError('Requisition not found');
    }

    const institution = await this.getInstitution(ctx, requisition.institutionId);

    const connection = await connectionService.createConnection(ctx, projectId, userId, {
      institutionName: institution.name,
      institutionLogo: institution.logo,
      provider: ConnectionProvider.Nordigen,
    });

    await nordigenRepository.updateRequisition(ctx, projectId, userId, requisitionId, {
      status: requisitionNordigen.status,
      response: requisitionNordigen,
      connectionId: connection.id,
    });

    const nordigenAccounts = await this.getAccounts(ctx, projectId, userId, requisition.id);
    await Promise.all(
      nordigenAccounts.map(({ id, name, product }) =>
        connectionService.createAccount(ctx, projectId, userId, connection.id, {
          providerAccountId: id,
          providerAccountName: name,
          providerAccountProduct: product,
          accountId: null,
          // TODO: set the earliest available date
          syncFrom: null,
        })
      )
    );

    return connection;
  }

  async deleteRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<void> {
    const requisition = await this.getRequisition(ctx, projectId, userId, requisitionId);

    await nordigenRepository.deleteRequisition(ctx, projectId, userId, requisitionId);
    await this.client.requisition.deleteRequisition(requisition.requisitionId);
  }

  async getAccounts(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IProviderAccount[]> {
    const requisitionDAO = await nordigenRepository.getRequisition(ctx, projectId, userId, requisitionId);
    if (!requisitionDAO) {
      throw new NotFoundError('Requisition not found');
    }

    const requisitionNordigen: IRequisitionNordigen | undefined = await this.client.requisition.getRequisitionById(
      requisitionDAO.requisitionId
    );

    if (!requisitionNordigen) {
      throw new NotFoundError('Requisition not found');
    }

    const accounts: IProviderAccount[] = await Promise.all(
      requisitionNordigen.accounts.map(accountId =>
        this.client
          .account(accountId)
          .getDetails()
          .then((response: { account: IAccountNordigen }) => {
            const { cashAccountType, displayName, name, iban, currency, status, product } = response.account;
            const providerAccount: IProviderAccount = {
              id: accountId,
              cashAccountType: cashAccountType as CashAccountType,
              name: displayName || name || iban || '',
              currency,
              status,
              product,
            };
            return providerAccount;
          })
      )
    );

    return accounts.filter(account => account.status !== ProviderAccountStatus.Deleted);
  }
}

export const nordigenService = new NordigenServiceImpl({
  secretId,
  secretKey,
});
