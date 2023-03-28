import { action, computed, makeObservable, observable } from 'mobx';

import { Money } from './models/money';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UsersRepository } from './users-repository';
import {
  CreateMoneyData,
  CreateMoneyResponse,
  GetMoneysResponse,
  IApiMoney,
  IMoney,
  UpdateMoneyChanges,
  UpdateMoneyResponse,
} from '../types/money';
import { CurrenciesRepository } from './currency-repository';

export interface IMoneysApi {
  getMoneys: () => Promise<GetMoneysResponse>;
  createMoney: (data: CreateMoneyData) => Promise<CreateMoneyResponse>;
  updateMoney: (moneyId: string, changes: UpdateMoneyChanges) => Promise<UpdateMoneyResponse>;
  deleteMoney: (moneyId: string) => Promise<void>;
  sortMoneys: (moneyIds: string[]) => Promise<void>;
}

export class MoneysRepository extends ManageableStore {
  static storeName = 'MoneysRepository';

  private _moneys: Money[] = [];

  constructor(mainStore: MainStore, private api: IMoneysApi) {
    super(mainStore);

    makeObservable<MoneysRepository, '_moneys'>(this, {
      _moneys: observable.shallow,
      availableMoneys: computed,
      moneys: computed,
      clear: action,
      consume: action,
      deleteMoney: action,
    });
  }

  get moneys(): Money[] {
    return this._moneys.slice().sort(MoneysRepository.sort);
  }

  get availableMoneys(): Money[] {
    return this.moneys.filter(({ isEnabled }) => isEnabled);
  }

  private static sort(a: Money, b: Money): number {
    return (
      (a.sorting || b.sorting ? (!a.sorting ? 1 : !b.sorting ? -1 : a.sorting - b.sorting) : 0) ||
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }

  get(moneyId: string): Money | undefined {
    return this._moneys.find(({ id }) => id === moneyId);
  }

  consume(moneys: IApiMoney[]): void {
    this._moneys = moneys.map(money => this.decode(money));
  }

  getMoneys(): Promise<void> {
    return this.api.getMoneys().then(({ moneys }) => {
      this.consume(moneys);
    });
  }

  createMoney(money: Partial<IMoney> | Money, data: CreateMoneyData): Promise<void> {
    return this.api.createMoney(data).then(
      action(response => {
        const money = this.decode(response.money);
        this._moneys.push(money);
      })
    );
  }

  updateMoney(money: Money, changes: UpdateMoneyChanges): Promise<void> {
    return this.api.updateMoney(money.id, changes).then(
      action(response => {
        const updatedMoney = this.decode(response.money);
        const indexOf = this._moneys.indexOf(money);
        if (indexOf !== -1) {
          this._moneys[indexOf] = updatedMoney;
        } else {
          this._moneys.push(updatedMoney);
        }
      })
    );
  }

  deleteMoney(money: Money): Promise<void> {
    money.isDeleting = true;
    return this.api
      .deleteMoney(money.id)
      .then(
        action(() => {
          const indexOf = this._moneys.indexOf(money);
          if (indexOf !== -1) {
            this._moneys.splice(indexOf, 1);
          }
        })
      )
      .finally(
        action(() => {
          money.isDeleting = false;
        })
      );
  }

  private decode(money: IApiMoney): Money {
    const { id, currencyId, name, symbol, precision, isEnabled, sorting, userId } = money;
    const currenciesRepository = this.getStore(CurrenciesRepository);
    const usersRepository = this.getStore(UsersRepository);

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }
    const currency = (currencyId && currenciesRepository.get(currencyId)) || null;

    return new Money({
      id,
      currency,
      name,
      symbol,
      precision: precision ?? undefined,
      isEnabled,
      sorting,
      user,
    });
  }

  clear(): void {
    this._moneys = [];
  }
}
