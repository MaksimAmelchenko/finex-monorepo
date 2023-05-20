import * as uuid from 'uuid';

import { AccountDAO } from './models/account-dao';
import { ConnectionDAO } from './models/connection-dao';
import {
  ConnectionRepository,
  CreateAccountRepositoryData,
  CreateConnectionRepositoryData,
  IAccountDAO,
  IConnectionDAO,
  ICountryDAO,
  UpdateAccountRepositoryChanges,
} from './types';
import { CountryDAO } from './models/country-dao';
import { IRequestContext } from '../../types/app';

class ConnectionRepositoryImpl implements ConnectionRepository {
  async getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountryDAO[]> {
    ctx.log.trace('try to get countries');
    return CountryDAO.query(ctx.trx);
  }

  async getConnections(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string
  ): Promise<IConnectionDAO[]> {
    ctx.log.trace('try to get connections');
    return ConnectionDAO.query(ctx.trx).where({
      projectId: Number(projectId),
      userId: Number(userId),
    });
  }

  async getConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IConnectionDAO | undefined> {
    ctx.log.trace({ connectionId }, 'try to get connection');
    return ConnectionDAO.query(ctx.trx).findById([Number(projectId), Number(userId), connectionId]);
  }

  async createConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateConnectionRepositoryData
  ): Promise<IConnectionDAO> {
    ctx.log.trace({ data }, 'try to create connection');
    const id = uuid.v4();
    return ConnectionDAO.query(ctx.trx)
      .insert({
        projectId: Number(projectId),
        userId: Number(userId),
        id,
        ...data,
      })
      .returning('*');
  }

  async deleteConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<void> {
    ctx.log.trace({ connectionId }, 'try to delete connection');
    await ConnectionDAO.query(ctx.trx).deleteById([Number(projectId), Number(userId), connectionId]);
  }

  async createAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    data: CreateAccountRepositoryData
  ): Promise<IAccountDAO> {
    ctx.log.trace({ connectionId, data }, 'try to create account');
    const { providerAccountId, providerAccountName, providerAccountProduct, accountId, syncFrom } = data;
    return AccountDAO.query(ctx.trx)
      .insert({
        projectId: Number(projectId),
        userId: Number(userId),
        id: uuid.v4(),
        connectionId,
        providerAccountId,
        providerAccountName,
        providerAccountProduct,
        accountId: accountId ? Number(accountId) : undefined,
        syncFrom,
      })
      .returning('*');
  }

  async getAccounts(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IAccountDAO[]> {
    ctx.log.trace({ connectionId }, 'try to get accounts');
    return AccountDAO.query(ctx.trx).where({
      projectId: Number(projectId),
      userId: Number(userId),
      connectionId,
    });
  }

  async updateAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionAccountId: string,
    changes: UpdateAccountRepositoryChanges
  ): Promise<IAccountDAO> {
    ctx.log.trace({ connectionAccountId, changes }, 'try to update account');
    const { accountId, syncFrom } = changes;
    return AccountDAO.query(ctx.trx).patchAndFetchById([Number(projectId), Number(userId), connectionAccountId], {
      accountId: accountId === undefined ? undefined : accountId === null ? null : Number(accountId),
      syncFrom,
    });
  }
}

export const connectionRepository = new ConnectionRepositoryImpl();
