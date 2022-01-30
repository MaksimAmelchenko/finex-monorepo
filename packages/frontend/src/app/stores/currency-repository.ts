import { ICurrency, ICurrencyRaw } from '../types/currency';
import { Currency } from './models/currency';
import { ManageableStore } from '../core/manageable-store';

export interface ICurrenciesApi {}

export class CurrenciesRepository extends ManageableStore {
  static storeName = 'CurrenciesRepository';

  currencies: ICurrency[] = [];

  consume(currencies: ICurrencyRaw[]): void {
    this.currencies = currencies.map(
      ({ idCurrency, code, name, shortName, symbol }) =>
        new Currency({
          id: String(idCurrency),
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
