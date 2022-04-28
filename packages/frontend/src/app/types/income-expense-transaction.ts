import { Metadata, Permit, Sign, TDate } from './index';
import { IUser } from './user';
import { IContractor } from './contractor';
import { ICategory } from './category';
import { IAccount } from './account';
import { IMoney } from './money';
import { IUnit } from './unit';

export interface IIncomeExpenseTransactionRaw {
  idIEDetail: number;
  idIE: number;
  idUser: number;
  idContractor: number | null;
  idCategory: number;
  idAccount: number;
  idMoney: number;
  idPlan: number | null;
  idUnit: number | null;
  dIEDetail: TDate;
  reportPeriod: TDate;
  sign: Sign;
  sum: number;
  quantity: number;
  note: string;
  tags: string[];
  permit: Permit;
  colorMark: string;
  isNotConfirmed: boolean;
  nRepeat: number | null;
}

export interface IIncomeExpenseTransaction {
  id: string | null;
  cashFlowId: string | null;
  planId: string | null;
  user: IUser;
  contractor: IContractor | null;
  category: ICategory;
  account: IAccount;
  money: IMoney;
  unit: IUnit | null;
  dTransaction: TDate;
  reportPeriod: TDate;
  sign: Sign;
  amount: number;
  quantity: number;
  note: string;
  tags: string[];
  permit: Permit;
  colorMark: string;
  isNotConfirmed: boolean;
  nRepeat: number | null;

  //
  isSelected: boolean;
}

export interface IGetIncomeExpenseTransactionsParams {
  limit: number;
  offset: number;
  searchText?: string;
  dBegin?: TDate;
  dEnd?: TDate;
  sign?: Sign;
  contractors?: string;
  accounts?: string;
  categories?: string;
  tags?: string;
}

export interface IGetIncomeExpenseTransactionsResponse {
  ieDetails: IIncomeExpenseTransactionRaw[];
  metadata: Metadata;
}
