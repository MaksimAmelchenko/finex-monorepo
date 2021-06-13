import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { UsersRepository } from './users-repository';
import {
  IGetIncomeExpenseTransactionsParams,
  IGetIncomeExpenseTransactionsResponse,
  IIncomeExpenseTransaction,
  IIncomeExpenseTransactionRaw,
} from '../types/income-expense-transaction';
import { IncomeExpenseTransaction } from './models/income-expense-transaction';
import { ContractorsRepository } from './contractors-repository';
import { CategoriesRepository } from './categories-repository';
import { AccountsRepository } from './accounts-repository';
import { MoneysRepository } from './moneys-repository';
import { UnitsRepository } from './units-repository';
import { LoadState } from '../core/load-state';

export interface IIncomeExpenseTransactionsApi {
  get: (params: IGetIncomeExpenseTransactionsParams) => Promise<IGetIncomeExpenseTransactionsResponse>;
}

export class IncomeExpenseTransactionsRepository extends ManageableStore {
  static storeName = 'IncomeExpenseTransactionsRepository';
  limit: number;
  offset: number;
  total: number;

  incomeExpenseTransactions: IIncomeExpenseTransaction[] = [];
  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IIncomeExpenseTransactionsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;
    this.loadState = LoadState.none();
    this.incomeExpenseTransactions = [];

    makeObservable(this, {
      incomeExpenseTransactions: observable,
      loadState: observable,
      fetch: action,
      fetchNextPage: action,
      clear: action,
    });
  }

  async fetch(): Promise<void> {
    try {
      this.loadState = LoadState.pending();
      const response = await this.api.get({ offset: 0, limit: this.limit });
      const { ieDetails: incomeExpenseTransactions, metadata } = response;
      this.limit = metadata.limit;
      this.offset = metadata.offset;
      this.total = metadata.total;
      this.incomeExpenseTransactions = this.decode(incomeExpenseTransactions);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadState = LoadState.done();
    }
  }

  async fetchNextPage(): Promise<void> {
    try {
      const offset = this.offset ? this.offset + this.limit : 0;
      const response = await this.api.get({ offset, limit: this.limit });

      const { ieDetails: incomeExpenseTransactions, metadata } = response;
      this.limit = metadata.limit;
      this.offset = metadata.offset;
      this.total = metadata.total;
      this.incomeExpenseTransactions.push(...this.decode(incomeExpenseTransactions));
    } catch (e) {
      console.error(e);
    } finally {
      this.loadState = LoadState.done();
    }
  }

  private decode(incomeExpenseTransactions: IIncomeExpenseTransactionRaw[]): IIncomeExpenseTransaction[] {
    const usersRepository = this.getStore(UsersRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const accountsRepository = this.getStore(AccountsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const unitsRepository = this.getStore(UnitsRepository);

    return incomeExpenseTransactions.reduce<IIncomeExpenseTransaction[]>((acc, transactionRow) => {
      const {
        idIEDetail,
        idIE,
        idUser,
        idContractor,
        idCategory,
        idAccount,
        idMoney,
        idPlan,
        idUnit,
        dIEDetail,
        reportPeriod,
        sign,
        sum,
        quantity,
        note,
        tags,
        colorMark,
        isNotConfirmed,
        nRepeat,
        permit,
      } = transactionRow;

      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { transactionRow });
        return acc;
      }

      const contractor = contractorsRepository.get(String(idContractor));
      const category = categoriesRepository.get(String(idCategory));
      if (!category) {
        console.warn('Category not found', { transactionRow });
        return acc;
      }

      const account = accountsRepository.get(String(idAccount));
      if (!account) {
        console.warn('Account not found', { transactionRow });
        return acc;
      }

      const money = moneysRepository.get(String(idMoney));
      if (!money) {
        console.warn('Money not found', { transactionRow });
        return acc;
      }

      const unit = unitsRepository.get(String(idUnit));

      const incomeExpenseTransaction = new IncomeExpenseTransaction({
        id: String(idIEDetail),
        cashFlowId: String(idIE),
        user,
        contractor,
        category,
        account,
        money,
        unit,
        dTransaction: dIEDetail,
        reportPeriod,
        sign,
        sum,
        quantity,
        note,
        tags,
        permit,
        colorMark,
        isNotConfirmed,
        nRepeat,
      });

      acc.push(incomeExpenseTransaction);
      return acc;
    }, []);
  }

  clear(): void {
    this.incomeExpenseTransactions = [];
  }
}
