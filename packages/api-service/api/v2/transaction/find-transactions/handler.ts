import { FindTransactionsAPIQuery, ITransactionDTO } from '../../../../modules/transaction/types';
import { IPlannedTransactionDTO } from '../../../../modules/planned-transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { getRanges } from '../../../../libs/get-ranges';
import { plannedTransactionMapper } from '../../../../modules/planned-transaction/planned-transaction.mapper';
import { plannedTransactionService } from '../../../../modules/planned-transaction/planned-transaction.service';
import { transactionMapper } from '../../../../modules/transaction/transaction.mapper';
import { transactionService } from '../../../../modules/transaction/transaction.service';

export async function handler(ctx: IRequestContext<FindTransactionsAPIQuery, true>): Promise<IResponse<any>> {
  const {
    projectId,
    userId,
    params: { offset = 0, limit = 50, sign, searchText, startDate, endDate, accounts, categories, contractors, tags },
  } = ctx;

  const transactions: (ITransactionDTO | IPlannedTransactionDTO)[] = [];
  const params = {
    offset,
    limit,
    sign,
    searchText,
    startDate,
    endDate,
    accounts: accounts ? accounts.split(',') : undefined,
    categories: categories ? categories.split(',') : undefined,
    contractors: contractors ? contractors.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  };

  const findPlannedTransactionsResponse = await plannedTransactionService.findPlannedTransactions(
    ctx,
    projectId,
    userId,
    {
      ...params,
      offset: 0,
      limit: 50,
    }
  );

  const findTransactionsResponse = await transactionService.findTransactions(ctx, projectId, userId, {
    ...params,
    offset: 0,
    limit: 50,
  });

  const ranges = getRanges(offset, limit, [
    //
    findPlannedTransactionsResponse.transactions.length,
    findPlannedTransactionsResponse.metadata.total - findPlannedTransactionsResponse.transactions.length,
    findTransactionsResponse.transactions.length,
    findTransactionsResponse.metadata.total - findTransactionsResponse.transactions.length,
  ]);

  if (ranges[0].limit) {
    const { offset, limit } = ranges[0];
    transactions.push(
      ...findPlannedTransactionsResponse.transactions
        .slice(offset, offset + limit)
        .map(transaction => plannedTransactionMapper.toDTO(transaction))
    );
  }

  if (ranges[1].limit) {
    const { offset, limit } = ranges[1];
    const { transactions: plannedTransactions } = await plannedTransactionService.findPlannedTransactions(
      ctx,
      projectId,
      userId,
      {
        ...params,
        offset: offset + findPlannedTransactionsResponse.transactions.length,
        limit,
      }
    );

    transactions.push(...plannedTransactions.map(transaction => plannedTransactionMapper.toDTO(transaction)));
  }

  if (ranges[2].limit) {
    const { offset, limit } = ranges[2];
    transactions.push(
      ...findTransactionsResponse.transactions
        .slice(offset, offset + limit)
        .map(transaction => transactionMapper.toDTO(transaction))
    );
  }

  if (ranges[3].limit) {
    const { offset, limit } = ranges[3];
    const { transactions: _transactions } = await transactionService.findTransactions(ctx, projectId, userId, {
      ...params,
      offset: offset + findTransactionsResponse.transactions.length,
      limit,
    });

    transactions.push(..._transactions.map(transaction => transactionMapper.toDTO(transaction)));
  }

  return {
    body: {
      metadata: {
        offset,
        limit,
        total: findPlannedTransactionsResponse.metadata.total + findTransactionsResponse.metadata.total,
      },
      transactions,
    },
  };
}
