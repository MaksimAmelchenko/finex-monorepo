import { action, makeObservable, observable, runInAction } from 'mobx';
import { addDays, format, subDays } from 'date-fns';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { ContractorsRepository } from './contractors-repository';
import { AccountsRepository } from './accounts-repository';
import { MoneysRepository } from './moneys-repository';
import { LoadState } from '../core/load-state';
import {
  IAccountBalance,
  IAccountBalanceRow,
  IAccountDailyBalance,
  IBalance,
  IBalanceRow,
  IDailyBalance,
  IDailyBalanceRow,
  IDebtBalance,
  IDebtBalanceRow,
  IGetBalanceParams,
  IGetBalanceResponse,
  IGetDailyBalanceParams,
  IGetDailyBalanceResponse,
} from '../types/balance';

export interface IBalanceApi {
  getBalance: (params: IGetBalanceParams) => Promise<IGetBalanceResponse>;
  getDailyBalance: (params: IGetDailyBalanceParams) => Promise<IGetDailyBalanceResponse>;
}

export class BalanceRepository extends ManageableStore {
  static storeName = 'DashboardRepository';

  accountBalances: IAccountBalance[] = [];
  debtBalances: IDebtBalance[] = [];
  balancesLoadState: LoadState = LoadState.none();

  dailyBalances: IAccountDailyBalance[] = [];
  dailyBalancesLoadState: LoadState = LoadState.none();

  constructor(mainStore: MainStore, private api: IBalanceApi) {
    super(mainStore);

    makeObservable(this, {
      accountBalances: observable,
      debtBalances: observable,
      balancesLoadState: observable,
      dailyBalances: observable,
      dailyBalancesLoadState: observable,
      fetchBalance: action,
      fetchDailyBalance: action,
      clear: action,
    });
  }

  async fetchBalance(): Promise<void> {
    try {
      this.balancesLoadState = LoadState.pending();
      const response = await this.api.getBalance({
        dBalance: format(new Date(), 'yyyy-MM-dd'),
        moneyId: undefined,
      });
      const { accountBalances, debtBalances } = response;
      runInAction(() => {
        this.accountBalances = this.decodeAccountBalances(accountBalances);
        this.debtBalances = this.decodeDebtBalances(debtBalances);
      });
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => {
        this.balancesLoadState = LoadState.done();
      });
    }
  }

  async fetchDailyBalance(): Promise<void> {
    try {
      this.dailyBalancesLoadState = LoadState.pending();
      const response = await this.api.getDailyBalance({
        dBegin: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
        dEnd: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
        moneyId: undefined,
      });
      const { balances } = response;
      runInAction(() => {
        this.dailyBalances = this.decodeDailyBalances(balances);
      });
    } catch (e) {
      console.error(e);
    } finally {
      runInAction(() => {
        this.dailyBalancesLoadState = LoadState.done();
      });
    }
  }

  private decodeAccountBalances(accountBalances: IAccountBalanceRow[]): IAccountBalance[] {
    const accountsRepository = this.getStore(AccountsRepository);

    return accountBalances.map(({ idAccount, balances }) => {
      const account = accountsRepository.get(String(idAccount))!;
      return {
        account,
        balances: this.decodeBalances(balances),
      };
    });
  }

  private decodeDebtBalances(debtBalances: IDebtBalanceRow[]): IDebtBalance[] {
    const contractorsRepository = this.getStore(ContractorsRepository);

    return debtBalances.map(({ debtType, idContractor, balances }) => {
      const contractor = contractorsRepository.get(String(idContractor))!;
      return {
        contractor,
        debtType,
        balances: this.decodeBalances(balances),
      };
    });
  }

  private decodeDailyBalances(dailyBalances: IDailyBalanceRow[]): IDailyBalance[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const moneysRepository = this.getStore(MoneysRepository);

    return dailyBalances.map(({ dBalance, idAccount, idMoney, sum }) => {
      const account = accountsRepository.get(String(idAccount))!;
      const money = moneysRepository.get(String(idMoney))!;
      return {
        dBalance,
        account,
        money,
        sum,
      };
    });
  }

  private decodeBalances(balances: IBalanceRow[]): IBalance[] {
    const moneysRepository = this.getStore(MoneysRepository);
    return balances.map(({ idMoney, sum }) => {
      const money = moneysRepository.get(String(idMoney))!;
      return {
        money,
        sum,
      };
    });
  }

  clear(): void {
    this.accountBalances = [];
    this.debtBalances = [];
    this.dailyBalances = [];
  }
}
