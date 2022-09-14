import { IRequestContext, Permissions, Permit, Sign, TDate } from '../../types/app';

export interface IPlannedTransactionDAO {
  planId: string;
  contractorId: string | null;
  markerColor: string;
  repetitionNumber: number;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  note: string | null;
  tags: string[] | null;
  userId: string;
  permit: Permit;
}

export interface IPlannedTransactionEntity extends Omit<IPlannedTransactionDAO, 'note' | 'tags'> {
  note: string;
  tags: string[];
}

export interface IPlannedTransaction extends IPlannedTransactionEntity {}

export type IPlannedTransactionDTO = {
  planId: string;
  contractorId: string | null;
  markerColor: string;
  repetitionNumber: number;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  note: string;
  tags: string[];
  userId: string;
  permit: Permit;
};

export interface FindPlannedTransactionsRepositoryQuery {
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

export type FindPlannedTransactionsServiceQuery = FindPlannedTransactionsRepositoryQuery;

export interface FindPlannedTransactionsRepositoryResponse {
  transactions: IPlannedTransactionDAO[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FindPlannedTransactionsServiceResponse {
  transactions: IPlannedTransaction[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface PlannedTransactionRepository {
  findTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindPlannedTransactionsRepositoryQuery
  ): Promise<FindPlannedTransactionsRepositoryResponse>;
}

export interface PlannedTransactionService {
  findPlannedTransactions(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindPlannedTransactionsServiceQuery
  ): Promise<FindPlannedTransactionsServiceResponse>;
}

export interface PlannedTransactionMapper {
  toDTO(transaction: IPlannedTransaction): IPlannedTransactionDTO;
  toDomain(transactionDAO: IPlannedTransactionDAO, permissions: Permissions): IPlannedTransaction;
}
