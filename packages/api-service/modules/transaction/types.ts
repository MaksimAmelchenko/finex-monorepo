import { IRequestContext, Permit, Sign, TDate } from '../../types/app';

export interface ITransactionDAO {
  id: number;
  cashflowId: number;
  userId: string;
  sign: Sign;
  amount: number;
  moneyId: number;
  accountId: number;
  contractorId: number | null;
  categoryId: number | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: number | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: number[] | null;
  permit: Permit;
}

export interface ITransactionEntity {
  id: string;
  cashFlowId: string;
  userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  contractorId: string | null;
  categoryId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
}

export interface ITransaction extends ITransactionEntity {}

export type ITransactionDTO = {
  userId: string;
  cashFlowId: string;
  id: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  contractorId: string | null;
  categoryId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
};

export interface CreateTransactionRepositoryData {
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  contractorId?: string | null;
  categoryId?: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity?: number | null;
  unitId?: string | null;
  isNotConfirmed?: boolean;
  note?: string;
  tags?: string[];
}

export interface CreateTransactionServiceData extends CreateTransactionRepositoryData {
  planId?: string | null;
}

export type CreateTransactionAPIData = CreateTransactionRepositoryData & {
  cashFlowId?: string | null;
};

export interface FindTransactionsAPIQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string;
  accounts?: string;
  categories?: string;
  tags?: string;
}

export interface FindTransactionsRepositoryQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  sign?: Sign;
  contractors?: string[];
  accounts?: string[];
  categories?: string[];
  tags?: string[];
}

export type FindTransactionsServiceQuery = FindTransactionsRepositoryQuery;

export interface FindTransactionsRepositoryResponse {
  transactions: ITransactionDAO[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FindTransactionsServiceResponse {
  transactions: ITransaction[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export type UpdateTransactionRepositoryChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export type UpdateTransactionServiceChanges = UpdateTransactionRepositoryChanges;

export interface TransactionRepository {
  findTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindTransactionsRepositoryQuery
  ): Promise<FindTransactionsRepositoryResponse>;
}

export interface TransactionService {
  createTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    cashFlowId: string,
    data: CreateTransactionServiceData
  ): Promise<ITransaction>;

  getTransaction(ctx: IRequestContext, projectId: string, transactionId: string): Promise<ITransaction>;

  findTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindTransactionsServiceQuery
  ): Promise<FindTransactionsServiceResponse>;

  updateTransaction(
    ctx: IRequestContext,
    projectId: string,
    transactionId: string,
    changes: UpdateTransactionServiceChanges
  ): Promise<ITransaction>;

  deleteTransaction(ctx: IRequestContext, projectId: string, transactionId: string): Promise<void>;
}

export interface TransactionMapper {
  toDTO(transaction: ITransaction): ITransactionDTO;
  toDomain(transaction: ITransactionDAO): ITransaction;
}
