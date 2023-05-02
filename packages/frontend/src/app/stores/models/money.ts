import { action, makeObservable, observable } from 'mobx';

import { IDeletable, ISelectable } from '../../types';
import { IMoney } from '../../types/money';
import { User } from './user';

export class Money implements IMoney, ISelectable, IDeletable {
  readonly id: string;
  readonly user: User;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision?: number;
  isEnabled: boolean;
  sorting: number | null;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, user, name, currencyCode, isEnabled, precision, sorting, symbol }: IMoney) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.currencyCode = currencyCode;
    this.isEnabled = isEnabled;
    this.precision = precision;
    this.sorting = sorting;
    this.symbol = symbol;

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
