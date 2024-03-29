import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { format, parseISO } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  CreateDebtData,
  CreateDebtItemData,
  CreateDebtItemResponse,
  CreateDebtResponse,
  GetDebtsQuery,
  GetDebtsResponse,
  IDebtDTO,
  IDebtItemDTO,
  UpdateDebtChanges,
  UpdateDebtItemChanges,
  UpdateDebtItemResponse,
  UpdateDebtResponse,
} from '../types/debt';
import { Debt } from './models/debt';
import { DebtItem } from './models/debt-item';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { TDate } from '../types';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UsersRepository } from './users-repository';

export interface IDebtsApi {
  getDebts: (query: GetDebtsQuery) => Promise<GetDebtsResponse>;
  createDebt: (data: CreateDebtData) => Promise<CreateDebtResponse>;
  createDebtItem: (debtId: string, data: CreateDebtItemData) => Promise<CreateDebtItemResponse>;
  updateDebt: (debtId: string, changes: UpdateDebtChanges) => Promise<UpdateDebtResponse>;
  updateDebtItem: (
    debtId: string,
    debtItemId: string,
    changes: UpdateDebtItemChanges
  ) => Promise<UpdateDebtItemResponse>;
  deleteDebt: (debtId: string) => Promise<void>;
  deleteDebtItem: (debtId: string, debtItemId: string) => Promise<void>;
}

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  contractors: string[];
  tags: string[];
  more: Array<'isOnlyNotPaid'>;
}

interface IDebtsByDate {
  date: TDate;
  debts: Debt[];
}

export class DebtsRepository extends ManageableStore {
  static storeName = 'DebtsRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    contractors: [],
    tags: [],
    more: ['isOnlyNotPaid'],
  };

  private _debts: Debt[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IDebtsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._debts = [];

    makeObservable<DebtsRepository, '_debts'>(this, {
      _debts: observable,
      filter: observable,
      loadState: observable,
      debts: computed,
      debtsByDates: computed,
      clear: action,
      fetch: action,
      removeDebt: action,
      removeDebtItem: action,
      setFilter: action,
    });

    reaction(
      () => this.filter,
      () => {
        this.refresh();
      }
    );
  }

  async fetch(reset = true): Promise<void> {
    this.loadState = LoadState.pending();
    const {
      isFilter,
      range: [startDate, endDate],
      searchText,
      contractors,
      tags,
      more,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        contractors: contractors.join(','),
        tags: tags.join(','),
        isOnlyNotPaid: more.includes('isOnlyNotPaid'),
      };
    }

    return this.api
      .getDebts({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ debts: debtDTOs, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          const debts = this.decode(debtDTOs);
          if (reset) {
            this._debts = debts;
          } else {
            this._debts = [...this._debts, ...debts];
          }
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
        })
      );
  }

  async fetchNextPage(): Promise<void> {
    this.offset = this.offset + this.limit;
    return this.fetch();
  }

  async fetchMore(): Promise<void> {
    this.offset = this.offset + this.limit;
    return this.fetch(false);
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

  getDebt(debtId: string): Debt | undefined {
    return this._debts.find(({ id }) => id === debtId);
  }

  createDebt(data: CreateDebtData): Promise<Debt> {
    return this.api.createDebt(data).then(
      action(response => {
        const newDebt = this.decode([response.debt])[0];
        if (!newDebt) {
          throw new Error('Debt create is failed');
        }

        this._debts.push(newDebt);
        return newDebt;
      })
    );
  }

  createDebtItem(debtId: string, data: CreateDebtItemData): Promise<unknown> {
    return this.api.createDebtItem(debtId, data).then(
      action(response => {
        const debtItem = this.decodeDebtItems([response.debtItem])[0];
        if (!debtItem) {
          console.error('debt item is not created');
          return;
        }
        const debt = this.getDebt(debtId);
        if (!debt) {
          console.error('debt is not found');
          return;
        }
        debt.items.push(debtItem);
      })
    );
  }

  updateDebt(debt: Debt, changes: UpdateDebtChanges): Promise<Debt> {
    return this.api.updateDebt(debt.id, changes).then(
      action(response => {
        const updatedDebt = this.decode([response.debt])[0];
        if (updatedDebt) {
          const indexOf = this._debts.indexOf(debt);
          if (indexOf !== -1) {
            this._debts[indexOf] = updatedDebt;
          } else {
            this._debts.push(updatedDebt);
          }
        } else {
          throw new Error('Debt update is failed');
        }
        return updatedDebt;
      })
    );
  }

  updateDebtItem(debtId: string, debtItemId: string, changes: UpdateDebtItemChanges): Promise<unknown> {
    return this.api.updateDebtItem(debtId, debtItemId, changes).then(
      action(response => {
        const updatedDebtItem = this.decodeDebtItems([response.debtItem])[0];
        if (!updatedDebtItem) {
          console.error('debt item is not updated');
          return;
        }

        const debt = this.getDebt(debtId);
        if (!debt) {
          console.error('debt is not found');
          return;
        }

        const indexOf = debt.items.findIndex(({ id }) => id === debtItemId);
        if (indexOf !== -1) {
          debt.items[indexOf] = updatedDebtItem;
        } else {
          debt.items.push(updatedDebtItem);
        }
      })
    );
  }

  removeDebt(debt: Debt): Promise<unknown> {
    debt.isDeleting = true;

    return this.api.deleteDebt(debt.id).then(
      action(() => {
        this._debts = this._debts.filter(t => t !== debt);
      })
    );
  }

  removeDebtItem(debtId: string, debtItemId: string): Promise<unknown> {
    // debtItem.isDeleting = true;

    return this.api.deleteDebtItem(debtId, debtItemId).then(
      action(() => {
        const debt = this.getDebt(debtId);
        if (!debt) {
          console.error('debt is not found');
          return;
        }

        debt.items = debt.items.filter(({ id }) => id !== debtItemId);
      })
    );
  }

  private decode(debts: IDebtDTO[]): Debt[] {
    const contractorsRepository = this.getStore(ContractorsRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return debts.reduce<Debt[]>((acc, debt) => {
      const { id, contractorId, note, tags: tagIds, userId, updatedAt } = debt;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { debt });
        return acc;
      }

      const contractor = contractorsRepository.get(contractorId);
      if (!contractor) {
        console.warn('Contractor is not found', { debt });
        return acc;
      }

      const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
        const tag = tagsRepository.get(tagId);
        if (tag) {
          acc.push(tag);
        }
        return acc;
      }, []);

      const items = this.decodeDebtItems(debt.items);

      acc.push(
        new Debt({
          id,
          contractor,
          note,
          tags,
          items,
          user,
          updatedAt,
        })
      );

      return acc;
    }, []);
  }

  private decodeDebtItems(debtItems: IDebtItemDTO[]): DebtItem[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return debtItems.reduce<DebtItem[]>((acc, debtItem) => {
      const {
        id,
        debtId,
        sign,
        amount,
        moneyId,
        categoryId,
        accountId,
        debtItemDate,
        reportPeriod,
        note,
        tags: tagIds,
        userId,
        permit,
        contractorId,
      } = debtItem;

      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money not found', { debtItem });
        return acc;
      }

      const category = categoriesRepository.get(categoryId);
      if (!category) {
        console.warn('Category not found', { debtItem });
        return acc;
      }

      const account = accountsRepository.get(accountId);
      if (!account) {
        console.warn('Account not found', { debtItem });
        return acc;
      }

      const contractor = contractorsRepository.get(contractorId);
      if (!contractor) {
        console.warn('Contractor not found', { debtItem });
        return acc;
      }

      const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
        const tag = tagsRepository.get(tagId);
        if (tag) {
          acc.push(tag);
        }
        return acc;
      }, []);

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { debtItem });
        return acc;
      }

      acc.push(
        new DebtItem({
          id,
          debtId,
          sign,
          amount,
          money,
          category,
          account,
          debtItemDate,
          reportPeriod,
          note,
          tags,
          user,
          permit,
          contractor,
        })
      );

      return acc;
    }, []);
  }

  get debts(): Debt[] {
    return this._debts
      .slice()
      .sort((a, b) => parseISO(b.debtDate).getTime() - parseISO(a.debtDate).getTime() || Number(b.id) - Number(a.id));
  }

  get debtsByDates(): IDebtsByDate[] {
    const map: Map<string, Debt[]> = new Map();
    this.debts.forEach(debt => {
      const date = format(parseISO(debt.debtDate), 'yyyy-MM-dd');
      const item = map.get(date);
      if (!item) {
        map.set(date, [debt]);
      } else {
        item.push(debt);
      }
    });

    return Array.from(map, ([date, debts]) => ({ date, debts }));
  }

  clear(): void {
    this.offset = 0;
    this.total = 0;
    this.loadState = LoadState.none();
    this._debts = [];
  }
}
