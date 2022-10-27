import { action, makeObservable, computed, observable } from 'mobx';
import { formatISO, parseISO } from 'date-fns';

import { Account } from './account';
import { CashFlowItem } from './cash-flow-item';
import { Category } from './category';
import { Contractor } from './contractor';
import { ICashFlow } from '../../types/cash-flow';
import { IDeletable, ISelectable, TDateTime } from '../../types';
import { Money } from './money';
import { Tag } from './tag';
import { User } from './user';

interface Balance {
  money: Money;
  income: number;
  expense: number;
}

export class CashFlow implements ICashFlow, ISelectable, IDeletable {
  readonly id: string;
  contractor: Contractor | null;
  note: string;
  tags: Tag[];
  user: User;
  items: CashFlowItem[];

  updatedAt: TDateTime;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, contractor, note, tags, items, user, updatedAt }: ICashFlow) {
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
      cashFlowDate: computed,
      accounts: computed,
      categories: computed,
      balances: computed,
      toggleSelection: action,
    });
  }

  get cashFlowDate(): TDateTime {
    let maxDate = Math.max(...this.items.map(({ cashFlowItemDate }) => parseISO(cashFlowItemDate).getTime()));
    if (maxDate !== -Infinity) {
      return formatISO(maxDate);
    }

    return this.updatedAt;
  }

  get balances(): Balance[] {
    const total = this.items.reduce<Map<string, Balance>>((acc, { money, sign, amount }) => {
      if (!acc.has(money.id)) {
        acc.set(money.id, { money, income: 0, expense: 0 });
      }
      if (sign === 1) {
        acc.get(money.id)!.income += amount;
      } else {
        acc.get(money.id)!.expense += amount;
      }

      return acc;
    }, new Map());

    return Array.from(total.values());
  }

  get accounts(): Account[] {
    return [...new Set(this.items.map(item => item.account))];
  }

  get categories(): Category[] {
    return [...new Set(this.items.map(({ category }) => category.path[0]))];
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
