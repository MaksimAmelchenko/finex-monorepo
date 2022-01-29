import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { UsersRepository } from './users-repository';
import { IMoney, IMoneyRaw } from '../types/money';
import { CurrenciesRepository } from './currency-repository';
import { ICurrency } from '../types/currency';
import { Money } from './models/money';

export interface IMoneysApi {}

export class MoneysRepository extends ManageableStore {
  static storeName = 'MoneysRepository';

  moneys: IMoney[] = [];

  constructor(mainStore: MainStore, private api: IMoneysApi) {
    super(mainStore);
    makeObservable(this, {
      moneys: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(moneys: IMoneyRaw[]): void {
    const usersRepository = this.getStore(UsersRepository);
    const currenciesRepository = this.getStore(CurrenciesRepository);
    this.moneys = moneys.reduce((acc, moneyRaw) => {
      const { idMoney, idCurrency, idUser, name, isEnabled, precision, sorting, symbol } = moneyRaw;
      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { moneyRaw });
        return acc;
      }

      let currency: ICurrency | null = null;
      if (idCurrency) {
        currency = currenciesRepository.get(String(idCurrency)) || null;
        if (!currency) {
          console.warn('Currency is not found', { moneyRaw });
          return acc;
        }
      }

      const money = new Money({
        id: String(idMoney),
        user,
        name,
        currency,
        precision,
        isEnabled,
        sorting,
        symbol,
      });
      acc.push(money);
      return acc;
    }, [] as IMoney[]);
  }

  get(moneyId: string): IMoney | undefined {
    return this.moneys.find(({ id }) => id === moneyId);
  }

  clear(): void {
    this.moneys = [];
  }
}
