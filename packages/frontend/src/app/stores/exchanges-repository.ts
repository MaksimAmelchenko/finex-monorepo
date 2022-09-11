import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { format, parseISO } from 'date-fns';

import { Account } from './models/account';
import { AccountsRepository } from './accounts-repository';
import { CreateExchangeData, IExchangeDTO, IExchangesApi, UpdateExchangeChanges } from '../types/exchange';
import { Exchange } from './models/exchange';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Money } from './models/money';
import { MoneysRepository } from './moneys-repository';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UsersRepository } from './users-repository';

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  accountsSell: string[];
  accountsBuy: string[];
  tags: string[];
}

export class ExchangesRepository extends ManageableStore {
  static storeName = 'ExchangesRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    accountsSell: [],
    accountsBuy: [],
    tags: [],
  };

  private _exchanges: Exchange[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IExchangesApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._exchanges = [];

    makeObservable<ExchangesRepository, '_exchanges'>(this, {
      _exchanges: observable,
      loadState: observable,
      filter: observable,
      exchanges: computed,
      clear: action,
      fetch: action,
      setFilter: action,
      removeExchange: action,
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
      accountsSell,
      accountsBuy,
      tags,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        accountsSell: accountsSell.join(','),
        accountsBuy: accountsBuy.join(','),
        tags: tags.join(','),
      };
    }

    return this.api
      .getExchanges({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ exchanges, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          this._exchanges = this.decode(exchanges);
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

  getExchange(exchangeId: string): Exchange | undefined {
    return this._exchanges.find(({ id }) => id === exchangeId);
  }

  createExchange(data: CreateExchangeData): Promise<Exchange> {
    return this.api.createExchange(data).then(
      action(response => {
        const newExchange = this.decode([response.exchange])[0];
        if (!newExchange) {
          throw new Error('Exchange create is failed');
        }

        this._exchanges.push(newExchange);
        return newExchange;
      })
    );
  }

  updateExchange(exchange: Exchange, changes: UpdateExchangeChanges): Promise<Exchange> {
    return this.api.updateExchange(exchange.id, changes).then(
      action(response => {
        const updatedExchange = this.decode([response.exchange])[0];
        if (updatedExchange) {
          const indexOf = this._exchanges.indexOf(exchange);
          if (indexOf !== -1) {
            this._exchanges[indexOf] = updatedExchange;
          } else {
            this._exchanges.push(updatedExchange);
          }
        } else {
          throw new Error('Exchange update is failed');
        }
        return updatedExchange;
      })
    );
  }

  removeExchange(exchange: Exchange): Promise<unknown> {
    exchange.isDeleting = true;

    return this.api.deleteExchange(exchange.id).then(
      action(() => {
        this._exchanges = this._exchanges.filter(t => t !== exchange);
      })
    );
  }

  private decode(exchanges: IExchangeDTO[]): Exchange[] {
    const moneysRepository = this.getStore(MoneysRepository);
    const accountsRepository = this.getStore(AccountsRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return exchanges.reduce<Exchange[]>((acc, exchange) => {
      const {
        userId,
        id,
        amountSell,
        moneySellId,
        amountBuy,
        moneyBuyId,
        accountSellId,
        accountBuyId,
        exchangeDate,
        reportPeriod,
        fee,
        moneyFeeId,
        accountFeeId,
        note,
        tags: tagIds,
        updatedAt,
      } = exchange;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { exchange });
        return acc;
      }

      const moneySell = moneysRepository.get(moneySellId);
      if (!moneySell) {
        console.warn('MoneySell is not found', { exchange });
        return acc;
      }

      const moneyBuy = moneysRepository.get(moneyBuyId);
      if (!moneyBuy) {
        console.warn('MoneyBuy is not found', { exchange });
        return acc;
      }

      const accountSell = accountsRepository.get(accountSellId);
      if (!accountSell) {
        console.warn('Contractor is not found', { exchange });
        return acc;
      }

      const accountBuy = accountsRepository.get(accountBuyId);
      if (!accountBuy) {
        console.warn('Contractor is not found', { exchange });
        return acc;
      }

      let moneyFee: Money | null = null;
      if (moneyFeeId) {
        moneyFee = moneysRepository.get(moneyFeeId) || null;
        if (!moneyFee) {
          console.warn('MoneyFee is not found', { exchange });
          return acc;
        }
      }

      let accountFee: Account | null = null;
      if (accountFeeId) {
        accountFee = accountsRepository.get(accountFeeId) || null;
        if (!accountFee) {
          console.warn('AccountFee is not found', { exchange });
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

      acc.push(
        new Exchange({
          id,
          amountSell,
          moneySell,
          amountBuy,
          moneyBuy,
          accountSell,
          accountBuy,
          exchangeDate,
          reportPeriod,
          fee,
          moneyFee,
          accountFee,
          note,
          tags,
          user,
          updatedAt,
        })
      );

      return acc;
    }, []);
  }

  get exchanges(): Exchange[] {
    return this._exchanges
      .slice()
      .sort(
        (a, b) => parseISO(b.exchangeDate).getTime() - parseISO(a.exchangeDate).getTime() || Number(b.id) - Number(a.id)
      );
  }

  clear(): void {
    this._exchanges = [];
  }
}
