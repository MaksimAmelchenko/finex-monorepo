import { action, computed, makeObservable, observable } from 'mobx';
import { format, formatISO, parseISO } from 'date-fns';

import { Account } from './account';
import { Balance, balanceByMoney } from '../../lib/balance-by-money';
import { CashFlowItem } from './cash-flow-item';
import { Category } from './category';
import { Contractor } from './contractor';
import { IBalance } from '../../types/balance';
import { ICashFlow } from '../../types/cash-flow';
import { IDeletable, ISelectable, TDate, TDateTime } from '../../types';
import { Tag } from './tag';
import { User } from './user';
import { moneyId } from '../../types/money';

export type BalanceType = 'inflow' | 'outflow' | 'total';

export interface ICashFlowItemsByDate {
  date: TDate;
  cashFlowItems: CashFlowItem[];
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
      accounts: computed,
      balance: computed,
      balances_DEPRECATED: computed,
      cashFlowDate: computed,
      cashFlowItems: computed,
      cashFlowItemsByDates: computed,
      categories: computed,
      toggleSelection: action,
    });
  }

  get cashFlowDate(): TDateTime {
    const maxDate = Math.max(...this.items.map(({ cashFlowItemDate }) => parseISO(cashFlowItemDate).getTime()));
    if (maxDate !== -Infinity) {
      return formatISO(maxDate);
    }

    return this.updatedAt;
  }

  get balances_DEPRECATED(): Balance[] {
    return balanceByMoney(this.items);
  }

  get balance(): Record<BalanceType, Record<moneyId, IBalance>> {
    return this.items.reduce<Record<BalanceType, Record<moneyId, IBalance>>>(
      (acc, { sign, amount, money }) => {
        if (sign === 1) {
          acc.inflow[money.id] = acc.inflow[money.id] || { amount: 0, money };
          acc.inflow[money.id].amount += amount;
        } else {
          acc.outflow[money.id] = acc.outflow[money.id] || { amount: 0, money };
          acc.outflow[money.id].amount += amount;
        }

        acc.total[money.id] = acc.total[money.id] || { amount: 0, money };
        acc.total[money.id].amount += sign * amount;

        return acc;
      },
      {
        total: {},
        inflow: {},
        outflow: {},
      }
    );
  }

  get accounts(): Account[] {
    return [...new Set(this.items.map(item => item.account))];
  }

  get categories(): Category[] {
    return [...new Set(this.items.filter(({ category }) => category).map(({ category }) => category!.path[0]))];
  }

  get cashFlowItems(): CashFlowItem[] {
    return this.items
      .slice()
      .sort(
        (a, b) =>
          parseISO(b.cashFlowItemDate).getTime() - parseISO(a.cashFlowItemDate).getTime() || Number(b.id) - Number(a.id)
      );
  }

  get cashFlowItemsByDates(): ICashFlowItemsByDate[] {
    const map: Map<string, CashFlowItem[]> = new Map();
    this.cashFlowItems.forEach(cashFlowItem => {
      const date = format(parseISO(cashFlowItem.cashFlowItemDate), 'yyyy-MM-dd');
      const item = map.get(date);
      if (!item) {
        map.set(date, [cashFlowItem]);
      } else {
        item.push(cashFlowItem);
      }
    });

    return Array.from(map, ([date, cashFlowItems]) => ({ date, cashFlowItems }));
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
