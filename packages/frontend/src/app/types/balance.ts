import { TDate } from './index';
import { IAccount } from './account';
import { IMoney } from './money';
import { IContractor } from './contractor';

export interface IGetBalanceParams {
  dBalance: TDate;
  moneyId?: string;
}

export interface IGetBalanceResponse {
  accountBalances: IAccountBalanceRow[];
  debtBalances: IDebtBalanceRow[];
}

export interface IAccountBalanceRow {
  idAccount: number;
  balances: IBalanceRow[];
}

export interface IDebtBalanceRow {
  debtType: number;
  idContractor: number;
  balances: IBalanceRow[];
}

export interface IBalanceRow {
  idMoney: number;
  sum: number;
}

export interface IGetDailyBalanceParams {
  dBegin: TDate;
  dEnd: TDate;
  moneyId?: string;
}

export interface IGetDailyBalanceResponse {
  balances: IDailyBalanceRow[];
}

export interface IDailyBalanceRow {
  dBalance: TDate;
  idAccount: number;
  idMoney: number;
  sum: number;
}

export interface IDailyBalance {
  dBalance: TDate;
  account: IAccount;
  money: IMoney;
  sum: number;
}

export interface IAccountBalance {
  account: IAccount;
  balances: IBalance[];
}

export interface IDebtBalance {
  debtType: number;
  contractor: IContractor;
  balances: IBalance[];
}

export interface IBalance {
  money: IMoney;
  sum: number;
}

export interface IAccountDailyBalance {
  dBalance: TDate;
  account: IAccount;
  money: IMoney;
  sum: number;
}