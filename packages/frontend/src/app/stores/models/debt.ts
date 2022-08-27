import { action, makeObservable, computed, observable } from 'mobx';

import { Contractor } from './contractor';
import { DebtItem } from './debt-item';
import { IDebt } from '../../types/debt';
import { IDeletable, ISelectable, TDateTime } from '../../types';
import { Tag } from './tag';
import { User } from './user';
import { formatISO, parseISO } from 'date-fns';

export class Debt implements IDebt, ISelectable, IDeletable {
  readonly id: string;
  contractor: Contractor;
  note: string;
  tags: Tag[];
  user: User;
  items: DebtItem[];

  updatedAt: TDateTime;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, contractor, note, tags, items, user, updatedAt }: IDebt) {
    this.id = id;
    this.contractor = contractor;
    this.note = note;
    this.tags = tags;
    this.user = user;
    this.items = items;
    this.isDeleting = false;
    this.isSelected = false;
    this.updatedAt = updatedAt;

    makeObservable(this, {
      isDeleting: observable,
      isSelected: observable,
      items: observable,
      debtDate: computed,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  get balance(): Record<string, Record<'debt' | 'paidDebt' | 'paidInterest' | 'fine' | 'fee', number>> {
    return this.items.reduce<any>((acc, item) => {
      acc[item.money.id] = acc[item.money.id] || {};
      let category = '';
      switch (item.category.categoryPrototype!.id) {
        case '2':
          category = 'debt';
          break;
        case '3':
          category = 'paidDebt';
          break;
        case '4':
          category = 'paidInterest';
          break;
        case '5':
          category = 'fine';
          break;
        case '6':
          category = 'fee';
          break;
      }
      acc[item.money.id][category] = acc[item.money.id][category] || 0;
      acc[item.money.id][category] += item.sign * item.amount;
      return acc;
    }, {});
  }

  get debtDate(): TDateTime {
    let maxDate = Math.max(...this.items.map(({ debtItemDate }) => parseISO(debtItemDate).getTime()));
    if (maxDate !== -Infinity) {
      return formatISO(maxDate);
    }

    return this.updatedAt;
  }
}
