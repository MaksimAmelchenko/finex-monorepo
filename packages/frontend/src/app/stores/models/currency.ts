import { ICurrency } from '../../types/currency';

export class Currency implements ICurrency {
  readonly code: string;
  readonly name: string;
  readonly precision: number;
  readonly symbol: string;

  constructor({ code, name, precision, symbol }: ICurrency) {
    this.code = code;
    this.name = name;
    this.precision = precision;
    this.symbol = symbol;
  }
}
