import { ITransaction } from './transaction';
import { Metadata, Permit, Sign, TDate } from './index';

export interface IAPIIncomeExpenseTransaction {
  id: string | null;
  cashFlowId: string | null;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  contractorId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string | null;
  tags: string[];
  permit: Permit;
  userId: string;

  planId: string | null;
  nRepeat: number | null;
  colorMark: string | null;
}

export interface IPlannedTransaction extends Omit<ITransaction, 'id' | 'cashFlowId'> {
  planId: string;
  nRepeat: number;
  colorMark: string;
}

export interface GetIncomeExpenseTransactionsQuery {
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

export interface GetIncomeExpenseTransactionsResponse {
  transactions: IAPIIncomeExpenseTransaction[];
  metadata: Metadata;
}

export interface CreateTransactionData {
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  contractorId: string | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  planId: string | null;
}

export interface CreateTransactionResponse {
  transaction: IAPIIncomeExpenseTransaction;
}

export type UpdateTransactionChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  categoryId: string;
  accountId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export interface UpdateTransactionResponse {
  transaction: IAPIIncomeExpenseTransaction;
}
