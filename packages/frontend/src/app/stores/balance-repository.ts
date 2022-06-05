import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { format } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { ContractorsRepository } from './contractors-repository';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Money } from './models/money';
import { MoneysRepository } from './moneys-repository';
import { getT } from '../lib/core/i18n';
import {
  IAccountBalance,
  IApiAccountBalance,
  IApiBalance,
  IApiDailyBalance,
  IApiDebtBalance,
  IBalance,
  IDailyBalance,
  IDebtBalance,
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
  money: Money;
  amount: number;
};

export type TreeBalance = {
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

const t = getT('BalanceRepository');

export class BalanceRepository extends ManageableStore {
  static storeName = 'DashboardRepository';

  accountBalances: IAccountBalance[] = [];
  debtBalances: IDebtBalance[] = [];
  balancesLoadState: LoadState = LoadState.none();

  dailyBalances: IDailyBalance[] = [];
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

  async fetchBalance({ moneyId, date = new Date() }: { moneyId?: string; date?: Date }): Promise<void> {
    try {
      this.balancesLoadState = LoadState.pending();
      const response = await this.api.getBalance({
        dBalance: format(date, 'yyyy-MM-dd'),
        moneyId,
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

  async fetchDailyBalance({ moneyId, range }: { moneyId?: string; range: [Date, Date] }): Promise<void> {
    try {
      const [dBegin, dEnd] = range;
      this.dailyBalancesLoadState = LoadState.pending();
      const response = await this.api.getDailyBalance({
        moneyId,
        dBegin: format(dBegin, 'yyyy-MM-dd'),
        dEnd: format(dEnd, 'yyyy-MM-dd'),
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

  private decodeAccountBalances(accountBalances: IApiAccountBalance[]): IAccountBalance[] {
    const accountsRepository = this.getStore(AccountsRepository);

    return accountBalances.map(({ idAccount, balances }) => {
      const account = accountsRepository.get(String(idAccount))!;
      return {
        account,
        balances: this.decodeBalances(balances),
      };
    });
  }

  private decodeDebtBalances(debtBalances: IApiDebtBalance[]): IDebtBalance[] {
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

  private decodeDailyBalances(dailyBalances: IApiDailyBalance[]): IDailyBalance[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const moneysRepository = this.getStore(MoneysRepository);

    return dailyBalances.map(({ dBalance, idAccount, idMoney, sum }) => {
      const accountId = idAccount === 0 ? null : String(idAccount);
      const moneyId = String(idMoney);

      const account = accountId ? accountsRepository.get(accountId)! : null;
      const money = moneysRepository.get(moneyId)!;

      return {
        dBalance,
        account,
        money,
        sum,
      };
    });
  }

  private decodeBalances(balances: IApiBalance[]): IBalance[] {
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
    const moneysRepository = this.getStore(MoneysRepository);

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

    return Array.from(total.values()).sort(
      (a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)
    );
  }

  get treeBalance(): TreeBalance {
    const treeBalanceMap: TreeBalanceMap = new Map();
    const moneysRepository = this.getStore(MoneysRepository);
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
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money))
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

  private get debtMap(): { [debtType: string]: { id: string; name: string } } {
    return {
      1: { id: '121aae0f-0587-42da-967d-05cb3d4a5be1', name: t('Owe me') },
      2: { id: '2c09e754-a02b-4518-8362-a954edba4d12', name: t('I owe') },
    };
  }

  get treeDebt(): TreeBalance {
    const treeDebtMap: TreeBalanceMap = new Map();
    const moneysRepository = this.getStore(MoneysRepository);

    // sort by debtType, contractor.name
    const debtBalances = this.debtBalances
      .slice()
      .sort(
        (a, b) =>
          a.debtType - b.debtType || a.contractor.name.localeCompare(b.contractor.name, 'en', { sensitivity: 'base' })
      )
      .map(({ contractor, debtType, balances }) => {
        return {
          contractor,
          debtType,
          balances: balances
            .slice()
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money))
            .map(({ money, sum: amount }) => ({ money, amount })),
        };
      });

    debtBalances.forEach(({ contractor, debtType, balances }) => {
      const debt = this.debtMap[debtType];
      if (!treeDebtMap.has(debt.id)) {
        treeDebtMap.set(debt.id, {
          path: [debt.id],
          label: debt.name,
          balanceMap: new Map(),
        });
      }

      balances.forEach(({ money, amount }) => {
        if (!treeDebtMap.get(debt.id)!.balanceMap.has(money.id)) {
          treeDebtMap.get(debt.id)!.balanceMap.set(money.id, {
            money,
            amount: 0,
          });
        }

        treeDebtMap.get(debt.id)!.balanceMap.get(money.id)!.amount += amount;
      });

      treeDebtMap.set(`${debtType}:${contractor.id}`, {
        path: [debt.id, contractor.id],
        label: contractor.name,
        balanceMap: balances.reduce<Map<string, Balance>>((acc, { money, amount }) => {
          acc.set(money.id, {
            money,
            amount,
          });
          return acc;
        }, new Map()),
      });
    });

    return Array.from(treeDebtMap.values()).map(({ path, label, balanceMap }) => {
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
