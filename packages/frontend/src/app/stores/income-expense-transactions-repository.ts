import { action, makeObservable, observable, reaction } from 'mobx';
import { format } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  IGetIncomeExpenseTransactionsParams,
  IGetIncomeExpenseTransactionsResponse,
  IIncomeExpenseTransactionRaw,
} from '../types/income-expense-transaction';
import { IncomeExpenseTransaction } from './models/income-expense-transaction';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

export interface IIncomeExpenseTransactionsApi {
  get: (params: IGetIncomeExpenseTransactionsParams) => Promise<IGetIncomeExpenseTransactionsResponse>;
}

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  accounts: string[];
  categories: string[];
  contractors: string[];
  tags: string[];
}

export class IncomeExpenseTransactionsRepository extends ManageableStore {
  static storeName = 'IncomeExpenseTransactionsRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    accounts: [],
    categories: [],
    contractors: [],
    tags: [],
  };

  incomeExpenseTransactions: IncomeExpenseTransaction[];
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
      filter: observable,
      clear: action,
      fetch: action,
      setFilter: action,
    });

    reaction(
      () => this.filter,
      () => {
        this.refresh();
      }
    );
  }

  async fetch(): Promise<void> {
    this.loadState = LoadState.pending();
    const {
      isFilter,
      range: [dBegin, dEnd],
      searchText,
      accounts,
      categories,
      contractors,
      tags,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        dBegin: dBegin ? format(dBegin, 'yyyy-MM-dd') : null,
        dEnd: dEnd ? format(dEnd, 'yyyy-MM-dd') : null,
        accounts: accounts.join(','),
        categories: categories.join(','),
        contractors: contractors.join(','),
        tags: tags.join(','),
      };
    }

    return await this.api
      .get({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ ieDetails: incomeExpenseTransactions, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          this.incomeExpenseTransactions = this.decode(incomeExpenseTransactions);
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
        })
      )
      .catch(
        action(err => {
          this.loadState = LoadState.error(err);
        })
      );
  }

  async fetchNextPage(): Promise<void> {
    this.offset = this.offset + this.limit;
    return this.fetch();
  }

  async fetchPreviousPage(): Promise<void> {
    this.offset = Math.max(this.offset - this.limit, 0);
    return this.fetch();
  }

  async refresh(): Promise<void> {
    this.offset = 0;
    return this.fetch();
  }

  setFilter(filter: Partial<IFilter>) {
    this.filter = {
      ...this.filter,
      ...filter,
    };
  }

  private decode(incomeExpenseTransactions: IIncomeExpenseTransactionRaw[]): IncomeExpenseTransaction[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return incomeExpenseTransactions.reduce<IncomeExpenseTransaction[]>((acc, transactionRow) => {
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
        sum: amount,
        quantity,
        note,
        tags,
        colorMark,
        isNotConfirmed,
        nRepeat,
        permit,
      } = transactionRow;

      const userId = String(idUser);
      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { transactionRow });
        return acc;
      }

      const contractorId = idContractor ? String(idContractor) : null;
      const contractor = contractorId ? contractorsRepository.get(contractorId) ?? null : null;

      const categoryId = String(idCategory);
      const category = categoriesRepository.get(categoryId);
      if (!category) {
        console.warn('Category not found', { transactionRow });
        return acc;
      }

      const accountId = String(idAccount);
      const account = accountsRepository.get(accountId);
      if (!account) {
        console.warn('Account not found', { transactionRow });
        return acc;
      }

      const moneyId = String(idMoney);
      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money not found', { transactionRow });
        return acc;
      }

      const unitId = idUnit ? String(idUnit) : null;
      const unit = unitId ? unitsRepository.get(unitId) ?? null : null;

      const planId = idPlan ? String(idPlan) : null;
      const id = idIEDetail ? String(idIEDetail) : null;
      const cashFlowId = idIE ? String(idIE) : null;

      const incomeExpenseTransaction = new IncomeExpenseTransaction({
        id,
        cashFlowId,
        user,
        planId,
        contractor,
        category,
        account,
        money,
        unit,
        dTransaction: dIEDetail,
        reportPeriod,
        sign,
        amount,
        quantity,
        note,
        tags,
        permit,
        colorMark,
        isNotConfirmed,
        nRepeat,
        isSelected: false,
      });

      acc.push(incomeExpenseTransaction);
      return acc;
    }, []);
  }

  clear(): void {
    this.incomeExpenseTransactions = [];
  }
}
