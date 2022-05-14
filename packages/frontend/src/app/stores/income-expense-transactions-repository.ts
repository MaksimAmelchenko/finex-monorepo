import { action, makeObservable, observable, reaction, computed } from 'mobx';
import { format, parseISO } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  CreateTransactionData,
  CreateTransactionResponse,
  GetIncomeExpenseTransactionsQuery,
  GetIncomeExpenseTransactionsResponse,
  IAPIIncomeExpenseTransaction,
  UpdateTransactionChanges,
  UpdateTransactionResponse,
} from '../types/income-expense-transaction';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { PlannedTransaction } from './models/planned-transaction';
import { Transaction } from './models/transaction';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';
import { ITransaction } from '../types/transaction';
import { PlansRepository } from './plans-repository';

export interface IIncomeExpenseTransactionsApi {
  get: (query: GetIncomeExpenseTransactionsQuery) => Promise<GetIncomeExpenseTransactionsResponse>;
  create: (data: CreateTransactionData) => Promise<CreateTransactionResponse>;
  update: (transactionId: string, changes: UpdateTransactionChanges) => Promise<UpdateTransactionResponse>;
  remove: (transactionId: string) => Promise<void>;
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

export type IncomeExpenseTransaction = Transaction | PlannedTransaction;

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

  private _incomeExpenseTransactions: IncomeExpenseTransaction[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IIncomeExpenseTransactionsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._incomeExpenseTransactions = [];

    makeObservable<IncomeExpenseTransactionsRepository, '_incomeExpenseTransactions'>(this, {
      _incomeExpenseTransactions: observable,
      loadState: observable,
      filter: observable,
      incomeExpenseTransactions: computed,
      clear: action,
      fetch: action,
      setFilter: action,
      removeTransaction: action,
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
          this._incomeExpenseTransactions = this.decode(transactions);
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

  createTransaction(
    transaction: Partial<ITransaction> | PlannedTransaction,
    data: CreateTransactionData
  ): Promise<unknown> {
    return this.api.create(data).then(
      action(response => {
        const newTransaction = this.decode([response.transaction])[0];
        if (!newTransaction) {
          return;
        }

        if (transaction instanceof PlannedTransaction) {
          // need to replace planned transaction
          const indexOf = this._incomeExpenseTransactions.indexOf(transaction);
          if (indexOf !== -1) {
            this._incomeExpenseTransactions[indexOf] = newTransaction;
          } else {
            this._incomeExpenseTransactions.push(newTransaction);
          }
        } else {
          // just add new transaction
          this._incomeExpenseTransactions.push(newTransaction);
        }
      })
    );
  }

  updateTransaction(transaction: Transaction, changes: UpdateTransactionChanges): Promise<unknown> {
    return this.api.update(transaction.id, changes).then(
      action(response => {
        const updatedTransaction = this.decode([response.transaction])[0];
        if (updatedTransaction) {
          const indexOf = this._incomeExpenseTransactions.indexOf(transaction);
          if (indexOf !== -1) {
            this._incomeExpenseTransactions[indexOf] = updatedTransaction;
          } else {
            this._incomeExpenseTransactions.push(updatedTransaction);
          }
        }
      })
    );
  }

  removeTransaction(transaction: IncomeExpenseTransaction): Promise<unknown> {
    transaction.isDeleting = true;
    let operation: Promise<void>;
    if (transaction instanceof PlannedTransaction) {
      operation = this._mainStore
        .get(PlansRepository)
        .cancelPlan(transaction.planId, { excludedDate: transaction.transactionDate });
    } else {
      operation = this.api.remove(transaction.id);
    }

    return operation.then(
      action(() => {
        this._incomeExpenseTransactions = this._incomeExpenseTransactions.filter(t => t !== transaction);
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
        id,
        cashFlowId,
        sign,
        amount,
        moneyId,
        categoryId,
        accountId,
        contractorId,
        transactionDate,
        reportPeriod,
        quantity,
        unitId,
        isNotConfirmed,
        note,
        tags,
        planId,
        nRepeat,
        colorMark,
        permit,
        userId,
      } = transaction;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { transaction });
        return acc;
      }

      const contractor = (contractorId && contractorsRepository.get(contractorId)) || null;

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

      const unit = (unitId && unitsRepository.get(unitId)) || null;

      const incomeExpenseTransaction =
        id && cashFlowId
          ? new Transaction({
              id,
              cashFlowId,
              sign,
              amount,
              money,
              category,
              account,
              contractor,
              transactionDate,
              reportPeriod,
              unit,
              quantity,
              isNotConfirmed,
              note: note ?? '',
              tags,
              permit,
              user,
            })
          : new PlannedTransaction({
              planId: planId!,
              sign,
              amount,
              money,
              category,
              account,
              contractor,
              transactionDate,
              reportPeriod,
              unit,
              quantity,
              isNotConfirmed,
              note: note ?? '',
              tags,
              permit,
              user,
              nRepeat: nRepeat!,
              colorMark: colorMark!,
            });

      acc.push(incomeExpenseTransaction);
      return acc;
    }, []);
  }

  get incomeExpenseTransactions(): IncomeExpenseTransaction[] {
    return this._incomeExpenseTransactions
      .slice()
      .sort(
        (a, b) =>
          Number(Boolean((b as any).planId)) - Number(Boolean((a as any).planId)) ||
          parseISO(b.transactionDate).getTime() - parseISO(a.transactionDate).getTime() ||
          Number((b as any).id) - Number((a as any).id)
      );
  }

  clear(): void {
    this._incomeExpenseTransactions = [];
  }
}
