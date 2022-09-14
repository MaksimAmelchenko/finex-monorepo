import {
  FindPlannedTransactionsServiceQuery,
  FindPlannedTransactionsServiceResponse,
  PlannedTransactionRepository,
  PlannedTransactionService,
} from './types';
import { IRequestContext } from '../../types/app';
import { plannedTransactionMapper } from './planned-transaction.mapper';
import { plannedTransactionRepository } from './planned-transaction.repository';

class PlannedTransactionServiceImpl implements PlannedTransactionService {
  private plannedTransactionRepository: PlannedTransactionRepository;

  constructor({ plannedTransactionRepository }: { plannedTransactionRepository: PlannedTransactionRepository }) {
    this.plannedTransactionRepository = plannedTransactionRepository;
  }

  async findPlannedTransactions(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    query: FindPlannedTransactionsServiceQuery
  ): Promise<FindPlannedTransactionsServiceResponse> {
    const { transactions, metadata } = await this.plannedTransactionRepository.findTransactions(
      ctx,
      projectId,
      userId,
      query
    );

    return {
      metadata,
      transactions: transactions.map(transaction => plannedTransactionMapper.toDomain(transaction)),
    };
  }
}

export const plannedTransactionService = new PlannedTransactionServiceImpl({
  plannedTransactionRepository,
});
