import { IApiCurrency, ICurrency } from '../types/currency';
import { Currency } from './models/currency';
import { ManageableStore } from '../core/manageable-store';

export interface ICurrenciesApi {}

export class CurrenciesRepository extends ManageableStore {
  static storeName = 'CurrenciesRepository';

  currencies: ICurrency[] = [];

  consume(currencies: IApiCurrency[]): void {
    this.currencies = currencies.map(
      ({ id, code, name, shortName, symbol }) =>
        new Currency({
          id,
          code,
          name,
          shortName,
          symbol,
        })
    );
  }

  get(currencyId: string): ICurrency | undefined {
    return this.currencies.find(({ id }) => id === currencyId);
  }

  clear(): void {
    this.currencies = [];
  }
}
