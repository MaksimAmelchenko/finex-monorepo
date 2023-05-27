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
  ICreateTransactionData,
  ITransactionDAO,
  UpdateAccountRepositoryChanges,
} from './types';
import { CountryDAO } from './models/country-dao';
import { IRequestContext } from '../../types/app';
import { TransactionDAO } from './models/transaction-dao';

class ConnectionRepositoryImpl implements ConnectionRepository {
  async getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountryDAO[]> {
    ctx.log.trace('try to get countries');
    return CountryDAO.query(ctx.trx);
  }

  async getConnections(ctx: IRequestContext<unknown, true>, projectId: string): Promise<IConnectionDAO[]> {
    ctx.log.trace('try to get connections');
    return ConnectionDAO.query(ctx.trx).where({
      projectId: Number(projectId),
    });
  }

  async getConnection(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    connectionId: string
  ): Promise<IConnectionDAO | undefined> {
    ctx.log.trace({ connectionId }, 'try to get connection');
    return ConnectionDAO.query(ctx.trx).findById([Number(projectId), connectionId]);
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

  async deleteConnection(ctx: IRequestContext<unknown, true>, projectId: string, connectionId: string): Promise<void> {
    ctx.log.trace({ connectionId }, 'try to delete connection');
    await ConnectionDAO.query(ctx.trx).deleteById([Number(projectId), connectionId]);
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
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    connectionId: string
  ): Promise<IAccountDAO[]> {
    ctx.log.trace({ connectionId }, 'try to get accounts');
    return AccountDAO.query(ctx.trx).where({
      projectId: Number(projectId),
      connectionId,
    });
  }

  async getAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    accountId: string
  ): Promise<IAccountDAO | undefined> {
    ctx.log.trace({ accountId }, 'try to get account');
    return AccountDAO.query(ctx.trx).findById([Number(projectId), accountId]);
  }

  async getActiveAccounts(ctx: IRequestContext<unknown, false>): Promise<IAccountDAO[]> {
    ctx.log.trace('try to get active accounts');
    return AccountDAO.query(ctx.trx).whereNotNull('accountId');
  }

  async updateAccount(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    connectionAccountId: string,
    changes: UpdateAccountRepositoryChanges
  ): Promise<IAccountDAO> {
    ctx.log.trace({ connectionAccountId, changes }, 'try to update account');
    const { accountId, syncFrom, lastSyncedAt } = changes;

    return AccountDAO.query(ctx.trx).patchAndFetchById([Number(projectId), connectionAccountId], {
      accountId: accountId === undefined ? undefined : accountId === null ? null : Number(accountId),
      syncFrom,
      lastSyncedAt,
    });
  }

  async createTransaction(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    data: ICreateTransactionData
  ): Promise<ITransactionDAO> {
    ctx.log.trace({}, 'try to create transaction');
    const { cashFlowId, providerTransactionId, ...rest } = data;
    return TransactionDAO.query(ctx.trx)
      .insert({
        projectId: Number(projectId),
        providerTransactionId,
        userId: Number(userId),
        cashFlowId: cashFlowId ? Number(cashFlowId) : undefined,
        ...rest,
      })
      .returning('*');
  }

  async getTransaction(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    transactionId: string
  ): Promise<ITransactionDAO | undefined> {
    ctx.log.trace({ transactionId }, 'try to get transaction');
    return TransactionDAO.query(ctx.trx).findById([Number(projectId), transactionId]);
  }
}

export const connectionRepository = new ConnectionRepositoryImpl();
