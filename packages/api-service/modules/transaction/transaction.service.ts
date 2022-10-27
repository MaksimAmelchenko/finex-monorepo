import { CashFlowItemService } from '../cash-flow-item/types';
import {
  CreateTransactionServiceData,
  FindTransactionsServiceQuery,
  FindTransactionsServiceResponse,
  ITransaction,
  TransactionRepository,
  TransactionService,
  UpdateTransactionServiceChanges,
} from './types';
import { CashFlowRepository, CashFlowType } from '../cash-flow/types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { cashFlowItemService } from '../cash-flow-item/cash-flow-item.service';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
import { transactionMapper } from './transaction.mapper';
import { transactionRepository } from './transaction.repository';
import { Transaction } from './models/transaction';

class TransactionServiceImpl implements TransactionService {
  private cashFlowItemService: CashFlowItemService;
  private cashFlowRepository: CashFlowRepository;
  private transactionRepository: TransactionRepository;

  constructor({
    cashFlowItemService,
    cashFlowRepository,
    transactionRepository,
  }: {
    cashFlowItemService: CashFlowItemService;
    cashFlowRepository: CashFlowRepository;
    transactionRepository: TransactionRepository;
  }) {
    this.cashFlowItemService = cashFlowItemService;
    this.cashFlowRepository = cashFlowRepository;
    this.transactionRepository = transactionRepository;
  }

  async createTransaction(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    cashFlowId: string | null,
    data: CreateTransactionServiceData
  ): Promise<ITransaction> {
    const {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      contractorId,
      transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
    } = data;

    let _cashFlowId: string | null = cashFlowId;
    if (!_cashFlowId) {
      const cashFlow = await this.cashFlowRepository.createCashFlow(ctx, projectId, userId, {
        cashFlowTypeId: CashFlowType.IncomeExpense,
        contractorId,
      });
      _cashFlowId = String(cashFlow.id);
    }

    const cashFlowItem = await this.cashFlowItemService.createCashFlowItem(ctx, projectId, userId, _cashFlowId, {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      cashFlowItemDate: transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
    });

    return this.getTransaction(ctx, projectId, cashFlowItem.id);
  }

  async getTransaction(ctx: IRequestContext, projectId: string, transactionId: string): Promise<ITransaction> {
    const {
      id,
      cashFlowId,
      userId,
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      cashFlowItemDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
      permit,
    } = await this.cashFlowItemService.getCashFlowItem(ctx, projectId, transactionId);

    const cashFlow = await this.cashFlowRepository.getCashFlow(ctx, projectId, cashFlowId);
    if (!cashFlow) {
      throw new NotFoundError();
    }

    return new Transaction({
      id,
      cashFlowId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId: cashFlow.contractorId ? String(cashFlow.contractorId) : null,
      transactionDate: cashFlowItemDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
      permit,
      userId,
    });
  }

  async findTransactions(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    query: FindTransactionsServiceQuery
  ): Promise<FindTransactionsServiceResponse> {
    const { transactions, metadata } = await this.transactionRepository.findTransactions(ctx, projectId, userId, query);
    return {
      metadata,
      transactions: transactions.map(transaction => transactionMapper.toDomain(transaction)),
    };
  }

  async updateTransaction(
    ctx: IRequestContext,
    projectId: string,
    transactionId: string,
    changes: UpdateTransactionServiceChanges
  ): Promise<ITransaction> {
    const {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
    } = changes;

    await this.cashFlowItemService.updateCashFlowItem(ctx, projectId, transactionId, {
      sign,
      amount,
      moneyId,
      accountId,
      categoryId,
      cashFlowItemDate: transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
    });

    return this.getTransaction(ctx, projectId, transactionId);
  }

  async deleteTransaction(ctx: IRequestContext, projectId: string, transactionId: string): Promise<void> {
    return this.cashFlowItemService.deleteCashFlowItem(ctx, projectId, transactionId);
  }
}

export const transactionService = new TransactionServiceImpl({
  cashFlowItemService,
  cashFlowRepository,
  transactionRepository,
});
