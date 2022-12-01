import { action, computed, makeObservable, observable } from 'mobx';
import { formatISO, parseISO } from 'date-fns';

import { Account } from './account';
import { Balance, balanceByMoney } from '../../lib/balance-by-money';
import { CashFlowItem } from './cash-flow-item';
import { Category } from './category';
import { Contractor } from './contractor';
import { ICashFlow } from '../../types/cash-flow';
import { IDeletable, ISelectable, TDateTime } from '../../types';
import { Tag } from './tag';
import { User } from './user';

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
    return balanceByMoney(this.items);
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
