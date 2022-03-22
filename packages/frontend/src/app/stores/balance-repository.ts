import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { addDays, format, subDays } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { ContractorsRepository } from './contractors-repository';
import { IMoney } from '../types/money';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import {
  IAccountBalance,
  IAccountBalanceRaw,
  IAccountDailyBalance,
  IBalance,
  IBalanceRaw,
  IDailyBalance,
  IDailyBalanceRaw,
  IDebtBalance,
  IDebtBalanceRaw,
  IGetBalanceParams,
  IGetBalanceResponse,
  IGetDailyBalanceParams,
  IGetDailyBalanceResponse,
} from '../types/balance';

export interface IBalanceApi {
  getBalance: (params: IGetBalanceParams) => Promise<IGetBalanceResponse>;
  getDailyBalance: (params: IGetDailyBalanceParams) => Promise<IGetDailyBalanceResponse>;
}

type Balance = {
  money: IMoney;
  amount: number;
};

type TreeBalance = {
  path: string[];
  label: string;
  balances: Balance[];
}[];

type TreeBalanceMap = Map<
  string,
  {
    path: string[];
    label: string;
    balanceMap: Map<string, Balance>;
  }
>;

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
      balancesLoadState: observable,
      clear: action,
      dailyBalances: observable,
      dailyBalancesLoadState: observable,
      debtBalances: observable,
      fetchBalance: action,
      fetchDailyBalance: action,
      totalBalance: computed,
      treeBalance: computed,
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

  private decodeAccountBalances(accountBalances: IAccountBalanceRaw[]): IAccountBalance[] {
    const accountsRepository = this.getStore(AccountsRepository);

    return accountBalances.map(({ idAccount, balances }) => {
      const account = accountsRepository.get(String(idAccount))!;
      return {
        account,
        balances: this.decodeBalances(balances),
      };
    });
  }

  private decodeDebtBalances(debtBalances: IDebtBalanceRaw[]): IDebtBalance[] {
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

  private decodeDailyBalances(dailyBalances: IDailyBalanceRaw[]): IDailyBalance[] {
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

  private decodeBalances(balances: IBalanceRaw[]): IBalance[] {
    const moneysRepository = this.getStore(MoneysRepository);
    return balances.map(({ idMoney, sum }) => {
      const money = moneysRepository.get(String(idMoney))!;
      return {
        money,
        sum,
      };
    });
  }

  get totalBalance(): Balance[] {
    const total: Map<string, Balance> = this.accountBalances.reduce<Map<string, Balance>>((acc, { balances }) => {
      balances.forEach(({ money, sum: amount }) => {
        if (!acc.has(money.id)) {
          acc.set(money.id, { money, amount });
        } else {
          acc.get(money.id)!.amount += amount;
        }
      });
      return acc;
    }, new Map());

    return Array.from(total.values()).sort((a, b) => a.money.sorting - b.money.sorting);
  }

  get treeBalance(): TreeBalance {
    const treeBalanceMap: TreeBalanceMap = new Map();
    // sort by accountType.name, account.name
    const accountBalances = this.accountBalances
      .slice()
      .sort(
        (a, b) =>
          a.account.accountType.name.localeCompare(b.account.accountType.name, 'en', { sensitivity: 'base' }) ||
          a.account.name.localeCompare(b.account.name, 'en', { sensitivity: 'base' })
      )
      .map(({ account, balances }) => {
        return {
          account,
          balances: balances
            .slice()
            .sort((a, b) => a.money.sorting - b.money.sorting)
            .map(({ money, sum: amount }) => ({ money, amount })),
        };
      });

    accountBalances.forEach(({ account, balances }) => {
      const { accountType } = account;
      if (!treeBalanceMap.has(accountType.id)) {
        treeBalanceMap.set(accountType.id, {
          path: [accountType.id],
          label: accountType.name,
          balanceMap: new Map(),
        });
      }

      balances.forEach(({ money, amount }) => {
        if (!treeBalanceMap.get(accountType.id)!.balanceMap.has(money.id)) {
          treeBalanceMap.get(accountType.id)!.balanceMap.set(money.id, {
            money,
            amount: 0,
          });
        }

        treeBalanceMap.get(accountType.id)!.balanceMap.get(money.id)!.amount += amount;
      });

      treeBalanceMap.set(`${accountType.id}:${account.id}`, {
        path: [accountType.id, account.id],
        label: account.name,
        balanceMap: balances.reduce<Map<string, Balance>>((acc, { money, amount }) => {
          acc.set(money.id, {
            money,
            amount,
          });
          return acc;
        }, new Map()),
      });
    });

    return Array.from(treeBalanceMap.values()).map(({ path, label, balanceMap }) => {
      return {
        path,
        label,
        balances: Array.from(balanceMap.values()),
      };
    });
  }

  clear(): void {
    this.accountBalances = [];
    this.debtBalances = [];
    this.dailyBalances = [];
  }
}
