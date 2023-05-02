import { makeObservable, observable } from 'mobx';

import { Currency } from './models/currency';
import { ICurrenciesApi, ICurrency, ICurrencyDTO } from '../types/currency';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';

export class CurrenciesRepository extends ManageableStore {
  static storeName = 'CurrenciesRepository';

  currencies: ICurrency[] = [];

  constructor(mainStore: MainStore, private api: ICurrenciesApi) {
    super(mainStore);

    makeObservable(this, {
      currencies: observable.shallow,
    });
  }

  getCurrencies(): Promise<void> {
    return this.api.getCurrencies().then(({ currencies }) => {
      this.consume(currencies);
    });
  }

  get(currencyCode: string): ICurrency | undefined {
    return this.currencies.find(({ code }) => code === currencyCode);
  }

  clear(): void {
    this.currencies = [];
  }

  private consume(currencies: ICurrencyDTO[]): void {
    this.currencies = currencies
      .map(
        ({ code, name, precision, symbol }) =>
          new Currency({
            code,
            name,
            precision,
            symbol,
          })
      )
      .sort((a, b) => a.code.localeCompare(b.code));
  }
}
