import { ICurrency } from '../../types/currency';

export class Currency implements ICurrency {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly shortName: string;
  readonly symbol: string;

  constructor({ id, code, name, shortName, symbol }: ICurrency) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.shortName = shortName;
    this.symbol = symbol;
  }
}
