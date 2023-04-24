import { ICurrency, ICurrencyEntity } from '../types';
import { TI18nField } from '../../../types/app';

export class Currency implements ICurrency {
  code: string;
  name: TI18nField<string>;
  precision: number;
  symbol: string;

  constructor({ code, name, precision, symbol }: ICurrencyEntity) {
    this.code = code;
    this.name = name;
    this.precision = precision;
    this.symbol = symbol;
  }
}
