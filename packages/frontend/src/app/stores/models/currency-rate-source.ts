import { ICurrencyRateSource } from '../../types/currencies-rate-source';

export class CurrencyRateSource implements ICurrencyRateSource {
  readonly id: string;
  readonly name: string;

  constructor({ id, name }: ICurrencyRateSource) {
    this.id = id;
    this.name = name;
  }
}
