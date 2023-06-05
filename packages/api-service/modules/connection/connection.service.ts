import { format, parse, parseISO, subMonths } from 'date-fns';

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
import { CategoryGateway } from '../../services/category/gateway';
import { ContractorGateway } from '../../services/contractor/gateway';
import { ContractorService } from '../../services/contractor';
import { CreateCashFlowItemServiceData } from '../cash-flow-item/types';
import { IRequestContext, TDate } from '../../types/app';
import { InternalError, InvalidParametersError, NotFoundError } from '../../libs/errors';
import { TagService } from '../../services/tag';
import { captureException } from '../../libs/sentry';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
import { connectionMapper } from './connection.mapper';
import { connectionRepository } from './connection.repository';
import { knex } from '../../knex';
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
    ctx: IRequestContext<unknown, false>,
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
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    accountId: string,
    changes: UpdateAccountServiceChanges
  ): Promise<IAccount> {
    const account = await connectionRepository.updateAccount(ctx, projectId, accountId, changes);
    return connectionMapper.toAccount(account);
  }

  async syncAccount(
    ctx: IRequestContext<unknown, false>,
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

    const moneys = await moneyService.getMoneys(ctx, projectId);

    let transactions: INormalizedTransaction[] = [];
    if (connection.provider === ConnectionProvider.Nordigen) {
      // the first time sync for all available time period, then sync for the last month
      const dateFrom: TDate = account.lastSyncedAt
        ? format(subMonths(parseISO(account.lastSyncedAt), 1), 'yyyy-MM-dd')
        : account.syncFrom ?? '';

      transactions = await nordigenService
        .getTransactions(ctx, account.providerAccountId, dateFrom)
        .then(({ transactions }) => {
          return nordigenETL.transform(ctx.log, connection, account, transactions, {
            accounts: accounts
              .filter(({ isEnabled }) => isEnabled)
              .map(account => ({
                id: String(account.idAccount),
                name: account.name,
                accountType: account.idAccountType,
                iban: account.note ?? '',
              })),
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

      // TODO add to connection settings
      const tagName = `sync-${connectionId.substring(0, 3)}`;
      let tag = await TagService.getTagByName(ctx, projectId, tagName);
      if (!tag) {
        tag = await TagService.createTag(ctx, projectId, userId, {
          name: tagName,
        });
      }

      let cashFlowId: string | null = null;
      if (isTransactionCashFlow(transactionCashFlow)) {
        let contractorId: string | null = null;
        let contractorName: string | null = null;
        let incomeCategoryId: string | null = null;
        let expenseCategoryId: string | null = null;

        if (transactionCashFlow.contractorName) {
          const cleanContractorName = await this.cleanContractorName(ctx, transactionCashFlow.contractorName);

          const recognizedContractor = await this.recognizedContractor(ctx, cleanContractorName);
          if (recognizedContractor) {
            const { incomeCategoryPrototypeId, expenseCategoryPrototypeId } = recognizedContractor;
            contractorName = recognizedContractor.name;

            if (incomeCategoryPrototypeId) {
              const categories = await CategoryGateway.getCategoriesByPrototype(
                ctx,
                projectId,
                incomeCategoryPrototypeId
              );
              if (categories.length === 1) {
                incomeCategoryId = String(categories[0].idCategory);
              }
            }

            if (expenseCategoryPrototypeId) {
              const categories = await CategoryGateway.getCategoriesByPrototype(
                ctx,
                projectId,
                expenseCategoryPrototypeId
              );
              if (categories.length === 1) {
                expenseCategoryId = String(categories[0].idCategory);
              }
            }
          } else {
            contractorName = cleanContractorName;
          }

          const contractor = await ContractorGateway.getContractorByName(ctx, projectId, contractorName);

          if (contractor) {
            contractorId = String(contractor.idContractor);
          } else {
            // TODO Maybe we should not create a contractor here. Add some kind of flag to create or not?
            await ContractorService.createContractor(ctx, projectId, userId, {
              name: contractorName,
            }).then(({ idContractor }) => (contractorId = String(idContractor)));
          }
        }

        const items: CreateCashFlowItemServiceData[] = transactionCashFlow.items.map(
          ({ sign, amount, currency, accountId, cashFlowItemDate, note }) => {
            const money = moneys.find(money => money.currencyCode?.toUpperCase() === currency.toUpperCase());
            if (!money) {
              throw new InvalidParametersError(`Money with currency ${currency} not found`);
            }

            const categoryId: string | null = sign === 1 ? incomeCategoryId : expenseCategoryId;

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
              tags: [tag!.id],
            };
          }
        );

        const cashFlowDAO = await cashFlowRepository.createCashFlowWithItems(ctx, projectId, userId, {
          contractorId,
          cashFlowTypeId: transactionCashFlow.cashFlowType,
          items,
          note: transactionCashFlow.note,
          tags: [tag!.id],
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
          tags: [tag!.id],
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

  async syncAllAccounts(ctx: IRequestContext<unknown, false>): Promise<any> {
    const accounts = await connectionRepository
      .getActiveAccounts(ctx)
      .then(accounts => accounts.map(account => connectionMapper.toAccount(account)));

    await nordigenService.generateToken(ctx);

    for (const account of accounts) {
      const { projectId, userId, connectionId, id } = account;
      await this.syncAccount(ctx, projectId, userId, connectionId, account.id).catch(err => {
        ctx.log.error(err);
        captureException(err);
      });
    }
  }

  private async cleanContractorName(ctx: IRequestContext<unknown, false>, name: string): Promise<string> {
    let query = knex.raw(
      `
          with
            --
            c as (select regexp_replace(:name, pattern, '\\1', 'gi') as clean_name
                    from cf$_connection.contractor_cleaning cc)
        select clean_name
          from c
         where clean_name != :name
         limit 1
      `,
      { name }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows } = await query;

    if (!rows.length) {
      return name;
    }

    return rows[0].clean_name;
  }

  private async recognizedContractor(
    ctx: IRequestContext<unknown, false>,
    contractorName: string
  ): Promise<
    | {
        name: string;
        incomeCategoryPrototypeId: string | null;
        expenseCategoryPrototypeId: string | null;
      }
    | undefined
  > {
    let query = knex.raw(
      `
        select cr.name,
               cr.income_category_prototype_id as "incomeCategoryPrototypeId",
               cr.expense_category_prototype_id as "expenseCategoryPrototypeId"
          from cf$_connection.contractor_recognition cr
         where :contractorName::text ~* cr.pattern
         limit 1
      `,
      { contractorName }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows } = await query;

    if (!rows.length) {
      return;
    }
    const { name, incomeCategoryPrototypeId, expenseCategoryPrototypeId } = rows[0];

    return {
      name: name || contractorName,
      incomeCategoryPrototypeId,
      expenseCategoryPrototypeId,
    };
  }
}

export const connectionService = new ConnectionServiceImpl();
