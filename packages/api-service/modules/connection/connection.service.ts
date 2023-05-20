import {
  ConnectionProvider,
  ConnectionService,
  CreateAccountServiceData,
  CreateConnectionServiceData,
  IAccount,
  IConnection,
  ICountry,
  UpdateAccountServiceChanges,
} from './types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { connectionMapper } from './connection.mapper';
import { connectionRepository } from './connection.repository';
import { nordigenService } from '../connection-nordigen/nordigen.service';

class ConnectionServiceImpl implements ConnectionService {
  async getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountry[]> {
    const countries = await connectionRepository.getCountries(ctx);
    return countries.map(connectionMapper.toCountry);
  }

  async getConnections(ctx: IRequestContext<unknown, true>, projectId: string, userId: string): Promise<IConnection[]> {
    const connectionDAOs = await connectionRepository.getConnections(ctx, projectId, userId);

    return Promise.all(
      connectionDAOs.map(connectionDAO => this.getConnection(ctx, projectId, userId, connectionDAO.id))
    );
  }

  async getConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IConnection> {
    const [connectionDAO, accountDAOs] = await Promise.all([
      connectionRepository.getConnection(ctx, projectId, userId, connectionId),
      connectionRepository.getAccounts(ctx, projectId, userId, connectionId),
    ]);

    if (!connectionDAO) {
      throw new NotFoundError('Connection not found');
    }

    return connectionMapper.toConnection(connectionDAO, accountDAOs);
  }

  async createConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateConnectionServiceData
  ): Promise<IConnection> {
    const connection = await connectionRepository.createConnection(ctx, projectId, userId, data);
    return this.getConnection(ctx, projectId, userId, connection.id);
  }

  async deleteConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<void> {
    const connection = await connectionRepository.getConnection(ctx, projectId, userId, connectionId);
    if (!connection) {
      throw new NotFoundError('Connection not found');
    }

    if (connection.provider === ConnectionProvider.Nordigen) {
      const requisition = await nordigenService.getRequisitionByConnectionId(ctx, projectId, userId, connectionId);
      await nordigenService.deleteRequisition(ctx, projectId, userId, requisition.id);
    }

    await connectionRepository.deleteConnection(ctx, projectId, userId, connectionId);
  }

  async createAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    data: CreateAccountServiceData
  ): Promise<IAccount> {
    const account = await connectionRepository.createAccount(ctx, projectId, userId, connectionId, data);
    return connectionMapper.toAccount(account);
  }

  async updateAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    accountId: string,
    changes: UpdateAccountServiceChanges
  ): Promise<IAccount> {
    const account = await connectionRepository.updateAccount(ctx, projectId, userId, accountId, changes);
    return connectionMapper.toAccount(account);
  }
}

export const connectionService = new ConnectionServiceImpl();
