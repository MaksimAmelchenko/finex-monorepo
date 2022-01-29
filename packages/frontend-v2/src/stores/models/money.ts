import { IUser } from '../../types/user';
import { IMoney } from '../../types/money';
import { ICurrency } from '../../types/currency';

export class Money implements IMoney {
  readonly id: string;
  readonly user: IUser;
  name: string;
  currency: ICurrency | null;
  isEnabled: boolean;
  precision: number;
  sorting: number;
  symbol: number;

  constructor({ id, user, name, currency, isEnabled, precision, sorting, symbol }: IMoney) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.currency = currency;
    this.isEnabled = isEnabled;
    this.precision = precision;
    this.sorting = sorting;
    this.symbol = symbol;
  }
}
