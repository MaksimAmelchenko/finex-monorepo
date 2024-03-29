import * as NordigenClient from 'nordigen-node';
import * as uuid from 'uuid';
import type NordigenClientType from 'nordigen-node';
import { format, subDays } from 'date-fns';

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
  IAgreement,
  IInstitution,
  INordigenTransactions,
  IRequisition,
  IRequisitionNordigen,
  NordigenService,
} from './types';
import { IRequestContext, TDate } from '../../types/app';
import { captureException } from '../../libs/sentry';
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
    this.client.generateToken().catch(err => captureException(err));
  }

  async generateToken(ctx: IRequestContext<unknown, false>): Promise<string> {
    return this.client.generateToken();
  }

  async getInstitutions(ctx: IRequestContext<unknown, true>, country: string): Promise<IInstitution[]> {
    return this.client.institution.getInstitutions({ country });
  }

  async getInstitution(ctx: IRequestContext<unknown, true>, institutionId: string): Promise<IInstitution> {
    return this.client.institution.getInstitutionById(institutionId);
  }

  async getAgreement(ctx: IRequestContext<unknown, true>, agreementId: string): Promise<IAgreement> {
    return this.client.agreement.getAgreementById(agreementId);
  }

  async createRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateRequisitionServiceData
  ): Promise<IRequisition> {
    const { locale } = ctx.params;
    const { institutionId, origin, isRetrieveMaxPeriodTransactions } = data;
    const requisitionId = uuid.v4();

    const institution = await this.getInstitution(ctx, institutionId);

    let maxHistoricalDays: number | undefined = undefined;
    if (isRetrieveMaxPeriodTransactions) {
      maxHistoricalDays = Number(institution.transaction_total_days);
    }

    const requisitionNordigen: IRequisitionNordigen = await this.client.initSession({
      redirectUrl: `${origin}/connections/nordigen/requisitions/complete`,
      institutionId,
      referenceId: requisitionId,
      maxHistoricalDays,
      userLanguage: locale,
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
    const requisitionDAO = await nordigenRepository.getRequisition(ctx, projectId, requisitionId);
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
    const requisitionDAO = await nordigenRepository.getRequisitionByConnectionId(ctx, projectId, connectionId);
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

    const [institution, agreement] = await Promise.all([
      this.getInstitution(ctx, requisition.institutionId),
      this.getAgreement(ctx, requisitionNordigen.agreement),
    ]);

    const connection = await connectionService.createConnection(ctx, projectId, userId, {
      institutionId: institution.id,
      institutionName: institution.name,
      institutionLogo: institution.logo,
      provider: ConnectionProvider.Nordigen,
    });

    await nordigenRepository.updateRequisition(ctx, projectId, requisitionId, {
      status: requisitionNordigen.status,
      response: requisitionNordigen,
      connectionId: connection.id,
    });

    const syncFrom = subDays(new Date(), Number(agreement.max_historical_days));

    const nordigenAccounts = await this.getAccounts(ctx, projectId, userId, requisition.id);

    await Promise.all(
      nordigenAccounts.map(({ id, name, product }) =>
        connectionService.createAccount(ctx, projectId, userId, connection.id, {
          providerAccountId: id,
          providerAccountName: name,
          providerAccountProduct: product,
          accountId: null,
          syncFrom: format(syncFrom, 'yyyy-MM-dd'),
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

    await nordigenRepository.deleteRequisition(ctx, projectId, requisitionId);
    await this.client.requisition.deleteRequisition(requisition.requisitionId);
  }

  async getAccounts(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IProviderAccount[]> {
    const requisitionDAO = await nordigenRepository.getRequisition(ctx, projectId, requisitionId);
    if (!requisitionDAO) {
      throw new NotFoundError('Requisition not found');
    }

    const requisitionNordigen: IRequisitionNordigen | undefined = await this.client.requisition.getRequisitionById(
      requisitionDAO.requisitionId
    );

    if (!requisitionNordigen) {
      throw new NotFoundError('NordigenRequisition not found');
    }

    const accounts: IProviderAccount[] = [];
    ctx.log.trace({ accounts: requisitionNordigen.accounts }, 'Receive accounts details');
    // process account one by one to avoid 429 error
    for (const accountId of requisitionNordigen.accounts) {
      ctx.log.trace({ accountId }, 'try to get account details');
      const account = await this.client
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
        });
      accounts.push(account);
    }

    return accounts.filter(account => account.status !== ProviderAccountStatus.Deleted);
  }

  async getTransactions(
    ctx: IRequestContext<unknown, false>,
    providerAccountId: string,
    dateFrom: TDate
  ): Promise<{ transactions: INordigenTransactions }> {
    return this.client.account(providerAccountId).getTransactions({ dateFrom, dateTo: '', country: '' });
  }
}

export const nordigenService = new NordigenServiceImpl({
  secretId,
  secretKey,
});
