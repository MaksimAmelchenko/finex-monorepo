import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { format, parseISO } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CashFlow } from './models/cash-flow';
import { CashFlowItem } from './models/cash-flow-item';
import { CategoriesRepository } from './categories-repository';
import { Contractor } from './models/contractor';
import { ContractorsRepository } from './contractors-repository';
import {
  CreateCashFlowData,
  CreateCashFlowItemData,
  ICashFlowDTO,
  ICashFlowItemDTO,
  ICashFlowsApi,
  UpdateCashFlowChanges,
  UpdateCashFlowItemChanges,
} from '../types/cash-flow';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { TDate } from '../types';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  accounts: string[];
  contractors: string[];
  tags: string[];
}

interface ICashFlowsByDate {
  date: TDate;
  cashFlows: CashFlow[];
}

export class CashFlowsRepository extends ManageableStore {
  static storeName = 'CashFlowsRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    accounts: [],
    contractors: [],
    tags: [],
  };

  private _cashFlows: CashFlow[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: ICashFlowsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._cashFlows = [];

    makeObservable<CashFlowsRepository, '_cashFlows'>(this, {
      _cashFlows: observable,
      filter: observable,
      loadState: observable,
      cashFlows: computed,
      cashFlowsByDates: computed,
      clear: action,
      fetch: action,
      fetchMore: action,
      removeCashFlow: action,
      removeCashFlowItem: action,
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
      accounts,
      contractors,
      tags,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        accounts: accounts.join(','),
        contractors: contractors.join(','),
        tags: tags.join(','),
      };
    }

    return this.api
      .getCashFlows({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ cashFlows: cashFlowDTOs, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          const cashFlows = this.decode(cashFlowDTOs);
          if (reset) {
            this._cashFlows = cashFlows;
          } else {
            this._cashFlows = [...this._cashFlows, ...cashFlows];
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

  async fetchPreviousPage(): Promise<void> {
    this.offset = Math.max(this.offset - this.limit, 0);
    return this.fetch();
  }

  async fetchMore(): Promise<void> {
    this.offset = this.offset + this.limit;
    return this.fetch(false);
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

  getCashFlow(cashFlowId: string): CashFlow | undefined {
    return this._cashFlows.find(({ id }) => id === cashFlowId);
  }

  createCashFlow(data: CreateCashFlowData): Promise<CashFlow> {
    return this.api.createCashFlow(data).then(
      action(response => {
        const newCashFlow = this.decode([response.cashFlow])[0];
        if (!newCashFlow) {
          throw new Error('Cash flow creation is failed');
        }

        this._cashFlows.push(newCashFlow);
        return newCashFlow;
      })
    );
  }

  createCashFlowItem(cashFlowId: string, data: CreateCashFlowItemData): Promise<unknown> {
    return this.api.createCashFlowItem(cashFlowId, data).then(
      action(response => {
        const cashFlowItem = this.decodeCashFlowItems([response.cashFlowItem])[0];
        if (!cashFlowItem) {
          console.error('Cash flow item is not created');
          return;
        }
        const cashFlow = this.getCashFlow(cashFlowId);
        if (!cashFlow) {
          console.error('Cash flow is not found');
          return;
        }
        cashFlow.items.push(cashFlowItem);
      })
    );
  }

  updateCashFlow(cashFlow: CashFlow, changes: UpdateCashFlowChanges): Promise<CashFlow> {
    return this.api.updateCashFlow(cashFlow.id, changes).then(
      action(response => {
        const updatedCashFlow = this.decode([response.cashFlow])[0];
        if (updatedCashFlow) {
          const indexOf = this._cashFlows.indexOf(cashFlow);
          if (indexOf !== -1) {
            this._cashFlows[indexOf] = updatedCashFlow;
          } else {
            this._cashFlows.push(updatedCashFlow);
          }
        } else {
          throw new Error('Cash flow update is failed');
        }
        return updatedCashFlow;
      })
    );
  }

  updateCashFlowItem(cashFlowId: string, cashFlowItemId: string, changes: UpdateCashFlowItemChanges): Promise<unknown> {
    return this.api.updateCashFlowItem(cashFlowId, cashFlowItemId, changes).then(
      action(response => {
        const updatedCashFlowItem = this.decodeCashFlowItems([response.cashFlowItem])[0];
        if (!updatedCashFlowItem) {
          console.error('Cash flow item is not updated');
          return;
        }

        const cashFlow = this.getCashFlow(cashFlowId);
        if (!cashFlow) {
          console.error('cashFlow is not found');
          return;
        }

        const indexOf = cashFlow.items.findIndex(({ id }) => id === cashFlowItemId);
        if (indexOf !== -1) {
          cashFlow.items[indexOf] = updatedCashFlowItem;
        } else {
          cashFlow.items.push(updatedCashFlowItem);
        }
      })
    );
  }

  removeCashFlow(cashFlow: CashFlow): Promise<unknown> {
    cashFlow.isDeleting = true;

    return this.api.deleteCashFlow(cashFlow.id).then(
      action(() => {
        this._cashFlows = this._cashFlows.filter(t => t !== cashFlow);
      })
    );
  }

  removeCashFlowItem(cashFlowId: string, cashFlowItemId: string): Promise<unknown> {
    /*
    cashFlowItem.isDeleting = true;
    */

    return this.api.deleteCashFlowItem(cashFlowId, cashFlowItemId).then(
      action(() => {
        const cashFlow = this.getCashFlow(cashFlowId);
        if (!cashFlow) {
          console.error('Cash flow is not found');
          return;
        }

        cashFlow.items = cashFlow.items.filter(({ id }) => id !== cashFlowItemId);
      })
    );
  }

  private decode(cashFlows: ICashFlowDTO[]): CashFlow[] {
    const contractorsRepository = this.getStore(ContractorsRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return cashFlows.reduce<CashFlow[]>((acc, cashFlow) => {
      const { id, contractorId, note, tags: tagIds, userId, updatedAt } = cashFlow;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { cashFlow });
        return acc;
      }

      let contractor: Contractor | null = null;
      if (contractorId) {
        contractor = contractorsRepository.get(contractorId) || null;
        if (!contractor) {
          console.warn('Contractor is not found', { cashFlow });
          return acc;
        }
      }

      const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
        const tag = tagsRepository.get(tagId);
        if (tag) {
          acc.push(tag);
        }
        return acc;
      }, []);

      const items = this.decodeCashFlowItems(cashFlow.items);

      acc.push(
        new CashFlow({
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

  private decodeCashFlowItems(cashFlowItems: ICashFlowItemDTO[]): CashFlowItem[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return cashFlowItems.reduce<CashFlowItem[]>((acc, cashFlowItem) => {
      const {
        id,
        cashFlowId,
        sign,
        amount,
        moneyId,
        categoryId,
        accountId,
        cashFlowItemDate,
        reportPeriod,
        quantity,
        unitId,
        isNotConfirmed,
        note,
        tags: tagIds,
        userId,
        permit,
      } = cashFlowItem;

      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money not found', { cashFlowItem });
        return acc;
      }

      const category = categoriesRepository.get(categoryId);
      if (!category) {
        console.warn('Category not found', { cashFlowItem });
        return acc;
      }

      const account = accountsRepository.get(accountId);
      if (!account) {
        console.warn('Account not found', { cashFlowItem });
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
        console.warn('User is not found', { cashFlowItem });
        return acc;
      }

      const unit = (unitId && unitsRepository.get(unitId)) || null;

      acc.push(
        new CashFlowItem({
          id,
          cashFlowId,
          sign,
          amount,
          money,
          category,
          account,
          cashFlowItemDate,
          reportPeriod,
          quantity,
          unit,
          isNotConfirmed,
          note,
          tags,
          user,
          permit,
        })
      );

      return acc;
    }, []);
  }

  get cashFlows(): CashFlow[] {
    return this._cashFlows
      .slice()
      .sort(
        (a, b) => parseISO(b.cashFlowDate).getTime() - parseISO(a.cashFlowDate).getTime() || Number(b.id) - Number(a.id)
      );
  }

  get cashFlowsByDates(): ICashFlowsByDate[] {
    const map: Map<string, CashFlow[]> = new Map();
    this.cashFlows.forEach(cashFlow => {
      const date = format(parseISO(cashFlow.cashFlowDate), 'yyyy-MM-dd');
      let item = map.get(date);
      if (!item) {
        map.set(date, [cashFlow]);
      } else {
        item.push(cashFlow);
      }
    });

    return Array.from(map, ([date, cashFlows]) => ({ date, cashFlows }));
  }

  clear(): void {
    this.offset = 0;
    this.total = 0;
    this.loadState = LoadState.none();
    this._cashFlows = [];
  }
}
