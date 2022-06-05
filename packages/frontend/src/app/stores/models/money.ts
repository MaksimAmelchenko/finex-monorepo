import { action, makeObservable, observable } from 'mobx';

import { Currency } from './currency';
import { IDeletable, ISelectable } from '../../types';
import { IMoney } from '../../types/money';
import { User } from './user';

export class Money implements IMoney, ISelectable, IDeletable {
  readonly id: string;
  readonly user: User;
  currency: Currency | null;
  name: string;
  symbol: string;
  precision?: number;
  isEnabled: boolean;
  sorting: number | null;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, user, name, currency, isEnabled, precision, sorting, symbol }: IMoney) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.currency = currency;
    this.isEnabled = isEnabled;
    this.precision = precision;
    this.sorting = sorting;
    this.symbol = symbol === 'руб' ? '₽' : symbol;

    this.isDeleting = false;
    this.isSelected = false;

    makeObservable(this, {
      isDeleting: observable,
      isSelected: observable,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
