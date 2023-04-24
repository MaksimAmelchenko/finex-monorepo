import { IRequestContext, TDate } from '../../types/app';

export interface IAccountsBalancesParams {
  balanceDate: TDate;
  moneyId: string | null;
}

export interface IAccountBalances {
  accountId: string;
  balances: Array<{
    moneyId: string;
    amount: number;
  }>;
}

export interface IAccountsDailyBalancesParams {
  startDate: TDate;
  endDate: TDate;
  moneyId: string | null;
}

export interface IAccountDailyBalance {
  moneyId: string;
  accountId: string;
  balanceDate: TDate;
  amount: number;
}

export interface AccountRepository {
  getBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsBalancesParams
  ): Promise<IAccountBalances[]>;

  getDailyBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsDailyBalancesParams
  ): Promise<IAccountDailyBalance[]>;
}

export interface AccountService {
  getBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsBalancesParams
  ): Promise<IAccountBalances[]>;

  getDailyBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsDailyBalancesParams
  ): Promise<IAccountDailyBalance[]>;
}

export interface AccountMapper {
  // toDTO(account: IAccount): IAccountDTO;
  // toDomain(accountDAO: IAccountDAO): IAccount;
}
