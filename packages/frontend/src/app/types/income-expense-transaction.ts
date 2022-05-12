import { IAccount } from './account';
import { ICategory } from './category';
import { IContractor } from './contractor';
import { IMoney } from './money';
import { IUnit } from './unit';
import { IUser } from './user';
import { Metadata, Permit, Sign, TDate } from './index';

export interface IAPIIncomeExpenseTransaction {
  id: string | null;
  cashFlowId: string | null;
  userId: string;
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
  planId: string | null;
  nRepeat: number | null;
  colorMark: string | null;
}

export interface IIncomeExpenseTransaction {
  id: string | null;
  cashFlowId: string | null;
  user: IUser;
  sign: Sign;
  amount: number;
  money: IMoney;
  category: ICategory;
  account: IAccount;
  contractor: IContractor | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: IUnit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];

  permit: Permit;
  planId: string | null;
  nRepeat: number | null;
  colorMark: string;

  //
  isSelected: boolean;
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

export interface CreateIncomeExpenseTransactionData {
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
  note: string;
  tags: string[];
  planId: string | null;
}

export type UpdateIncomeExpenseTransactionChanges = Partial<{
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
}>;

export interface CreateIncomeExpenseTransactionResponse {
  transaction: IAPIIncomeExpenseTransaction;
}

export interface UpdateIncomeExpenseTransactionResponse {
  transaction: IAPIIncomeExpenseTransaction;
}
