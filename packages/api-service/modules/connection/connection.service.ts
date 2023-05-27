import { format, parse } from 'date-fns';

import { AccountService } from '../../services/account';
import {
  ConnectionProvider,
  ConnectionService,
  CreateAccountServiceData,
  CreateConnectionServiceData,
  IAccount,
  IConnection,
  ICountry,
  INormalizedTransaction,
  isTransactionCashFlow,
  isTransactionTransfer,
  UpdateAccountServiceChanges,
} from './types';
import { ContractorGateway } from '../../services/contractor/gateway';
import { ContractorService } from '../../services/contractor';
import { CreateCashFlowItemServiceData } from '../cash-flow-item/types';
import { IRequestContext } from '../../types/app';
import { InternalError, InvalidParametersError, NotFoundError } from '../../libs/errors';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
import { connectionMapper } from './connection.mapper';
import { connectionRepository } from './connection.repository';
import { moneyService } from '../money/money.service';
import { nordigenETL } from '../connection-nordigen/nordigen-etl.service';
import { nordigenService } from '../connection-nordigen/nordigen.service';
import { transferRepository } from '../transfer/transfer.repository';

class ConnectionServiceImpl implements ConnectionService {
  async getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountry[]> {
    const countries = await connectionRepository.getCountries(ctx);
    return countries.map(connectionMapper.toCountry);
  }

  async getConnections(ctx: IRequestContext<unknown, true>, projectId: string, userId: string): Promise<IConnection[]> {
    const connectionDAOs = await connectionRepository.getConnections(ctx, projectId);

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
      connectionRepository.getConnection(ctx, projectId, connectionId),
      connectionRepository.getAccounts(ctx, projectId, connectionId),
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
    const connection = await connectionRepository.getConnection(ctx, projectId, connectionId);
    if (!connection) {
      throw new NotFoundError('Connection not found');
    }

    if (connection.provider === ConnectionProvider.Nordigen) {
      const requisition = await nordigenService.getRequisitionByConnectionId(ctx, projectId, userId, connectionId);
      await nordigenService.deleteRequisition(ctx, projectId, userId, requisition.id);
    }

    await connectionRepository.deleteConnection(ctx, projectId, connectionId);
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
    const account = await connectionRepository.updateAccount(ctx, projectId, accountId, changes);
    return connectionMapper.toAccount(account);
  }

  async syncAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    accountId: string
  ): Promise<any> {
    const connection = await this.getConnection(ctx, projectId, userId, connectionId);

    const account = connection.accounts.find(({ id }) => id === accountId);
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    const accounts = await AccountService.getAccounts(ctx, projectId, userId);
    // take first cash account
    const cashAccount = accounts.filter(account => account.isEnabled && account.idAccountType === 1)[0];

    const moneys = await moneyService.getMoneys(ctx, projectId);

    let transactions: INormalizedTransaction[] = [];
    if (connection.provider === ConnectionProvider.Nordigen) {
      transactions = await nordigenService
        .getTransactions(ctx, account.providerAccountId, account.syncFrom ?? '')
        .then(({ transactions }) => {
          return nordigenETL.transform(ctx.log, connection, account, transactions, {
            cashAccountId: cashAccount ? String(cashAccount.idAccount) : undefined,
          });
        });
    }

    for (const transaction of transactions) {
      if (!transaction.amount) {
        continue;
      }

      const transactionDAO = await connectionRepository.getTransaction(ctx, projectId, transaction.transactionId);
      if (transactionDAO) {
        continue;
      }

      const { cashFlow: transactionCashFlow } = transaction;

      let cashFlowId: string | null = null;

      if (isTransactionCashFlow(transactionCashFlow)) {
        let contractorId: string | null = null;
        if (transactionCashFlow.contractorName) {
          const contractor = await ContractorGateway.getContractorByName(
            ctx,
            projectId,
            transactionCashFlow.contractorName
          );

          if (contractor) {
            contractorId = String(contractor.idContractor);
          } else {
            // TODO Maybe we should not create a contractor here. Add some kind of flag to create or not?
            await ContractorService.createContractor(ctx, projectId, userId, {
              name: transactionCashFlow.contractorName,
            }).then(({ idContractor }) => (contractorId = String(idContractor)));
          }
        }

        const items: CreateCashFlowItemServiceData[] = transactionCashFlow.items.map(
          ({ sign, amount, currency, accountId, cashFlowItemDate, note }) => {
            const money = moneys.find(money => money.currencyCode?.toUpperCase() === currency.toUpperCase());
            if (!money) {
              throw new InvalidParametersError(`Money with currency ${currency} not found`);
            }

            let categoryId: string | null = null;
            // TODO Add category detection depending on the contractor

            return {
              sign,
              amount,
              moneyId: money.id,
              categoryId,
              accountId,
              cashFlowItemDate,
              reportPeriod: format(parse(cashFlowItemDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-01'),
              isNotConfirmed: false,
              note,
            };
          }
        );

        const cashFlowDAO = await cashFlowRepository.createCashFlowWithItems(ctx, projectId, userId, {
          contractorId,
          cashFlowTypeId: transactionCashFlow.cashFlowType,
          items,
          note: transactionCashFlow.note,
        });

        cashFlowId = String(cashFlowDAO.id);
      }

      if (isTransactionTransfer(transactionCashFlow)) {
        const { amount, currency, fromAccountId, toAccountId, transferDate, note } = transactionCashFlow;
        const money = moneys.find(money => money.currencyCode?.toUpperCase() === currency.toUpperCase());
        if (!money) {
          throw new InvalidParametersError(`Money with currency ${currency} not found`);
        }

        const transfer = await transferRepository.createTransfer(ctx, projectId, userId, {
          amount,
          moneyId: money.id,
          fromAccountId,
          toAccountId,
          transferDate,
          reportPeriod: format(parse(transferDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-01'),
          note,
        });

        cashFlowId = String(transfer.id);
      }

      if (!cashFlowId) {
        throw new InternalError('Not implemented');
      }

      const {
        transactionId: providerTransactionId,
        transactionDate,
        amount,
        currency,
        source,
        transformationName,
      } = transaction;

      await connectionRepository.createTransaction(ctx, projectId, userId, {
        cashFlowId,
        providerTransactionId,
        amount,
        currency,
        transformationName,
        source,
        transactionDate,
      });
    }

    await this.updateAccount(ctx, projectId, userId, accountId, {
      lastSyncedAt: new Date().toISOString(),
    });

    return transactions;
  }
}

export const connectionService = new ConnectionServiceImpl();
