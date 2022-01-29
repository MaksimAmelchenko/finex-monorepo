import { ManageableStore } from '../core/manageable-store';
import { ICurrencyRateSource, ICurrencyRateSourceRaw } from '../types/currencies-rate-source';
import { CurrencyRateSource } from './models/currency-rate-source';

export class CurrenciesRateSourceStore extends ManageableStore {
  static storeName = 'CurrenciesRateSourceStore';

  currencyRateSources: ICurrencyRateSource[] = [];

  consume(currencyRateSources: ICurrencyRateSourceRaw[]): void {
    this.currencyRateSources = currencyRateSources.map(
      ({ idCurrencyRateSource, name }) => new CurrencyRateSource({ id: String(idCurrencyRateSource), name })
    );
  }

  get(currencyRateSourceId: string): ICurrencyRateSource | undefined {
    return this.currencyRateSources.find(({ id }) => id === currencyRateSourceId);
  }

  clear(): void {
    this.currencyRateSources = [];
  }
}
