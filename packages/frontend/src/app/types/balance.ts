import { TDate } from './index';
import { Account } from '../stores/models/account';
import { Contractor } from '../stores/models/contractor';
import { Money } from '../stores/models/money';

export interface IGetBalanceParams {
  dBalance: TDate;
  moneyId?: string;
}

export interface IGetBalanceResponse {
  accountBalances: IApiAccountBalance[];
  debtBalances: IApiDebtBalance[];
}

export interface IApiAccountBalance {
  idAccount: number;
  balances: IApiBalance[];
}

export interface IApiDebtBalance {
  debtType: number;
  idContractor: number;
  balances: IApiBalance[];
}

export interface IApiBalance {
  idMoney: number;
  sum: number;
}

export interface IGetDailyBalanceParams {
  dBegin: TDate;
  dEnd: TDate;
  moneyId?: string;
}

export interface IGetDailyBalanceResponse {
  balances: IApiDailyBalance[];
}

export interface IApiDailyBalance {
  dBalance: TDate;
  idAccount: number;
  idMoney: number;
  sum: number;
}

export interface IDailyBalance {
  dBalance: TDate;
  account: Account | null;
  money: Money;
  sum: number;
}

export interface IAccountBalance {
  account: Account;
  balances: IBalance[];
}

export interface IDebtBalance {
  debtType: number;
  contractor: Contractor;
  balances: IBalance[];
}

export interface IBalance {
  amount: number;
  money: Money;
}
