import { action, makeObservable, observable, reaction } from 'mobx';
import { format } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  GetIncomeExpenseTransactionsQuery,
  GetIncomeExpenseTransactionsResponse,
  IAPIIncomeExpenseTransaction,
  CreateIncomeExpenseTransactionData,
  CreateIncomeExpenseTransactionResponse,
} from '../types/income-expense-transaction';
import { IncomeExpenseTransaction } from './models/income-expense-transaction';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

export interface IIncomeExpenseTransactionsApi {
  get: (query: GetIncomeExpenseTransactionsQuery) => Promise<GetIncomeExpenseTransactionsResponse>;
  create: (data: CreateIncomeExpenseTransactionData) => Promise<CreateIncomeExpenseTransactionResponse>;
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
      range: [startDate, endDate],
      searchText,
      accounts,
      categories,
      contractors,
      tags,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        dBegin: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        dEnd: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        accounts: accounts.join(','),
        categories: categories.join(','),
        contractors: contractors.join(','),
        tags: tags.join(','),
      };
    }

    return this.api
      .get({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ transactions, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          this.incomeExpenseTransactions = this.decode(transactions);
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

  addTransaction(data: CreateIncomeExpenseTransactionData): Promise<unknown> {
    console.log({ data });

    return this.api
      .create(data)
      .then(
        action(({ transaction }) => {
          this.incomeExpenseTransactions.push(...this.decode([transaction]));
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
        })
      );
  }

  private decode(incomeExpenseTransactions: IAPIIncomeExpenseTransaction[]): IncomeExpenseTransaction[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return incomeExpenseTransactions.reduce<IncomeExpenseTransaction[]>((acc, transaction) => {
      const {
        cashFlowId,
        id,
        userId,
        contractorId,
        categoryId,
        accountId,
        moneyId,
        planId,
        unitId,
        transactionDate,
        reportPeriod,
        sign,
        amount,
        quantity,
        note,
        tags,
        colorMark,
        isNotConfirmed,
        nRepeat,
        permit,
      } = transaction;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { transaction });
        return acc;
      }

      const contractor = contractorId ? contractorsRepository.get(contractorId) ?? null : null;

      const category = categoriesRepository.get(categoryId);
      if (!category) {
        console.warn('Category not found', { transaction });
        return acc;
      }

      const account = accountsRepository.get(accountId);
      if (!account) {
        console.warn('Account not found', { transaction });
        return acc;
      }

      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money not found', { transaction });
        return acc;
      }

      const unit = unitId ? unitsRepository.get(unitId) ?? null : null;

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
        transactionDate,
        reportPeriod,
        sign,
        amount,
        quantity,
        note: note ?? '',
        tags,
        permit,
        colorMark: colorMark ?? '',
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
