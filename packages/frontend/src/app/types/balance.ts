import { TDate } from './index';
import { Account } from '../stores/models/account';
import { Contractor } from '../stores/models/contractor';
import { Money } from '../stores/models/money';

export interface IGetBalanceParams {
  balanceDate: TDate;
  moneyId?: string;
}

export interface IGetBalanceResponse {
  accountsBalances: IAccountBalancesDTO[];
  debtsBalances: IDebtBalancesDTO[];
}

export interface IAccountBalancesDTO {
  accountId: string;
  balances: IBalanceDTO[];
}

export interface IDebtBalancesDTO {
  contractorId: string;
  debtType: 1 | 2;
  balances: IBalanceDTO[];
}

export interface IBalanceDTO {
  moneyId: string;
  amount: number;
}

export interface IGetDailyBalanceParams {
  startDate: TDate;
  endDate: TDate;
  moneyId?: string;
}

export interface IGetDailyBalanceResponse {
  accountDailyBalances: IDailyBalanceDTO[];
}

export interface IDailyBalanceDTO {
  moneyId: string;
  accounts: Array<{
    accountId: string;
    balances: Array<{
      date: TDate;
      amount: number;
    }>;
  }>;
}

export interface IDailyBalance {
  money: Money;
  accounts: Array<{
    account: Account;
    balances: Array<{
      date: TDate;
      amount: number;
    }>;
  }>;
}

export interface IAccountBalances {
  account: Account;
  balances: IBalance[];
}

export interface IDebtBalances {
  contractor: Contractor;
  debtType: 1 | 2;
  balances: IBalance[];
}

export interface IBalance {
  amount: number;
  money: Money;
}
