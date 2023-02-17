import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { format } from 'date-fns';

import { Account } from './models/account';
import { AccountType } from './models/account-type';
import { AccountsRepository } from './accounts-repository';
import { Contractor } from './models/contractor';
import { ContractorsRepository } from './contractors-repository';
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
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { getT } from '../lib/core/i18n';

export interface IBalanceApi {
  getBalance: (params: IGetBalanceParams) => Promise<IGetBalanceResponse>;
  getDailyBalance: (params: IGetDailyBalanceParams) => Promise<IGetDailyBalanceResponse>;
}

type accountTypeId = string;
type accountId = string;
type moneyId = string;
type debtTypeId = string;
type contractorId = string;

export type TreeBalance = {
  path: string[];
  label: string;
  balances: IBalance[];
}[];

type TreeBalanceMap = Map<
  string,
  {
    path: string[];
    label: string;
    balanceMap: Map<moneyId, IBalance>;
  }
>;

export type AccountTypeBalances = Array<{
  accountType: AccountType;
  balances: IBalance[];
  accountBalances: Array<{
    account: Account;
    balances: IBalance[];
  }>;
}>;

export type AccountTypeBalanceMap = Map<
  accountTypeId,
  {
    accountType: AccountType;
    balanceMap: Map<moneyId, IBalance>;
    accountBalanceMap: Map<
      accountId,
      {
        account: Account;
        balanceMap: Map<moneyId, IBalance>;
      }
    >;
  }
>;

interface DebtType {
  id: string;
  name: string;
}

export type DebtTypeBalances = Array<{
  debtType: DebtType;
  balances: IBalance[];
  contractorBalances: Array<{
    contractor: Contractor;
    balances: IBalance[];
  }>;
}>;

export type DebtTypeBalanceMap = Map<
  debtTypeId,
  {
    debtType: DebtType;
    balanceMap: Map<moneyId, IBalance>;
    contractorBalanceMap: Map<
      contractorId,
      {
        contractor: Contractor;
        balanceMap: Map<moneyId, IBalance>;
      }
    >;
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
      dailyBalances: observable,
      dailyBalancesLoadState: observable,
      debtBalances: observable,
      accountTypeBalances: computed,
      debtTypeBalances: computed,
      totalBalance: computed,
      treeBalance: computed,
      clear: action,
      fetchBalance: action,
      fetchDailyBalance: action,
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
    return balances.map(({ idMoney, sum: amount }) => {
      const money = moneysRepository.get(String(idMoney))!;
      return {
        amount,
        money,
      };
    });
  }

  get totalBalance(): IBalance[] {
    const moneysRepository = this.getStore(MoneysRepository);

    const total = this.accountBalances.reduce<Map<moneyId, IBalance>>((acc, { balances }) => {
      balances.forEach(({ amount, money }) => {
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
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)),
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
            amount,
            money,
          });
        } else {
          treeBalanceMap.get(accountType.id)!.balanceMap.get(money.id)!.amount += amount;
        }
      });

      treeBalanceMap.set(`${accountType.id}:${account.id}`, {
        path: [accountType.id, account.id],
        label: account.name,
        balanceMap: balances.reduce<Map<moneyId, IBalance>>((acc, { money, amount }) => {
          acc.set(money.id, {
            amount,
            money,
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

  get accountTypeBalances(): AccountTypeBalances {
    const accountTypeBalancesMap: AccountTypeBalanceMap = new Map();
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
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)),
        };
      });

    accountBalances.forEach(({ account, balances }) => {
      const { accountType } = account;
      if (!accountTypeBalancesMap.has(accountType.id)) {
        accountTypeBalancesMap.set(accountType.id, {
          accountType,
          balanceMap: new Map(),
          accountBalanceMap: new Map(),
        });
      }

      if (!accountTypeBalancesMap.get(accountType.id)!.accountBalanceMap.has(account.id)) {
        accountTypeBalancesMap.get(accountType.id)!.accountBalanceMap.set(account.id, {
          account,
          balanceMap: new Map(),
        });
      }

      balances.forEach(({ money, amount }) => {
        if (!accountTypeBalancesMap.get(accountType.id)!.balanceMap.has(money.id)) {
          accountTypeBalancesMap.get(accountType.id)!.balanceMap.set(money.id, {
            amount,
            money,
          });
        } else {
          accountTypeBalancesMap.get(accountType.id)!.balanceMap.get(money.id)!.amount += amount;
        }

        if (!accountTypeBalancesMap.get(accountType.id)!.accountBalanceMap.get(account.id)!.balanceMap.has(money.id)) {
          accountTypeBalancesMap.get(accountType.id)!.accountBalanceMap.get(account.id)!.balanceMap.set(money.id, {
            amount,
            money,
          });
        } else {
          accountTypeBalancesMap
            .get(accountType.id)!
            .accountBalanceMap.get(account.id)!
            .balanceMap.get(money.id)!.amount += amount;
        }
      });
    });

    return Array.from(accountTypeBalancesMap.values()).map(({ accountType, balanceMap, accountBalanceMap }) => {
      return {
        accountType,
        balances: Array.from(balanceMap.values()),
        accountBalances: Array.from(accountBalanceMap.values()).map(({ account, balanceMap }) => {
          return {
            account,
            balances: Array.from(balanceMap.values()),
          };
        }),
      };
    });
  }

  get debtTypeBalances(): DebtTypeBalances {
    const debtTypeBalancesMap: DebtTypeBalanceMap = new Map();
    const moneysRepository = this.getStore(MoneysRepository);

    // initial debts
    Object.keys(BalanceRepository.debtMap).forEach(key => {
      const debtType = BalanceRepository.debtMap[key];
      debtTypeBalancesMap.set(debtType.id, {
        debtType,
        balanceMap: new Map(),
        contractorBalanceMap: new Map(),
      });
    });
    // sort by debtType, contractor.name
    const debtBalances = this.debtBalances
      .slice()
      .sort(
        (a, b) =>
          a.debtType - b.debtType || a.contractor.name.localeCompare(b.contractor.name, 'en', { sensitivity: 'base' })
      )
      .map(({ contractor, debtType, balances }) => {
        return {
          debtType: BalanceRepository.debtMap[debtType],
          contractor,
          balances: balances
            .slice()
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)),
        };
      });

    debtBalances.forEach(({ debtType, contractor, balances }) => {
      if (!debtTypeBalancesMap.get(debtType.id)!.contractorBalanceMap.has(contractor.id)) {
        debtTypeBalancesMap.get(debtType.id)!.contractorBalanceMap.set(contractor.id, {
          contractor,
          balanceMap: new Map(),
        });
      }

      balances.forEach(({ money, amount }) => {
        if (!debtTypeBalancesMap.get(debtType.id)!.balanceMap.has(money.id)) {
          debtTypeBalancesMap.get(debtType.id)!.balanceMap.set(money.id, {
            amount,
            money,
          });
        } else {
          debtTypeBalancesMap.get(debtType.id)!.balanceMap.get(money.id)!.amount += amount;
        }

        if (!debtTypeBalancesMap.get(debtType.id)!.contractorBalanceMap.get(contractor.id)!.balanceMap.has(money.id)) {
          debtTypeBalancesMap.get(debtType.id)!.contractorBalanceMap.get(contractor.id)!.balanceMap.set(money.id, {
            amount,
            money,
          });
        } else {
          debtTypeBalancesMap
            .get(debtType.id)!
            .contractorBalanceMap.get(contractor.id)!
            .balanceMap.get(money.id)!.amount += amount;
        }
      });
    });

    return Array.from(debtTypeBalancesMap.values()).map(({ debtType, balanceMap, contractorBalanceMap }) => {
      return {
        debtType,
        balances: Array.from(balanceMap.values()),
        contractorBalances: Array.from(contractorBalanceMap.values()).map(({ contractor, balanceMap }) => {
          return {
            contractor,
            balances: Array.from(balanceMap.values()),
          };
        }),
      };
    });
  }

  private static get debtMap(): { [id: string]: DebtType } {
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
            .sort((a, b) => moneysRepository.moneys.indexOf(a.money) - moneysRepository.moneys.indexOf(b.money)),
        };
      });

    debtBalances.forEach(({ contractor, debtType, balances }) => {
      const debt = BalanceRepository.debtMap[debtType];
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
            amount,
            money,
          });
        } else {
          treeDebtMap.get(debt.id)!.balanceMap.get(money.id)!.amount += amount;
        }
      });

      treeDebtMap.set(`${debtType}:${contractor.id}`, {
        path: [debt.id, contractor.id],
        label: contractor.name,
        balanceMap: balances.reduce<Map<moneyId, IBalance>>((acc, { money, amount }) => {
          acc.set(money.id, {
            amount,
            money,
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
