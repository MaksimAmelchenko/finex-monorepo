import { action, computed, makeObservable, observable } from 'mobx';
import { format, parseISO } from 'date-fns';

import { Contractor } from './contractor';
import { DebtItem } from './debt-item';
import { IBalance } from '../../types/balance';
import { IDebt } from '../../types/debt';
import { IDeletable, ISelectable, TDate, TDateTime } from '../../types';
import { Tag } from './tag';
import { User } from './user';
import { moneyId } from '../../types/money';

export type BalanceType = 'debt' | 'paidDebt' | 'unpaidDebt' | 'paidInterest' | 'fine' | 'fee' | 'cost';

const balanceTypeMap: Record<string, BalanceType> = {
  '2': 'debt',
  '3': 'paidDebt',
  '4': 'paidInterest',
  '5': 'fine',
  '6': 'fee',
};

export interface IDebtItemsByDate {
  date: TDate;
  debtItems: DebtItem[];
}

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
      balance: computed,
      debtDate: computed,
      debtItems: computed,
      debtItemsByDates: computed,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  get balance_DEPRECATED(): Record<moneyId, Record<'debt' | 'paidDebt' | 'paidInterest' | 'fine' | 'fee', number>> {
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

  get debtItems(): DebtItem[] {
    return this.items
      .slice()
      .sort(
        (a, b) => parseISO(b.debtItemDate).getTime() - parseISO(a.debtItemDate).getTime() || Number(b.id) - Number(a.id)
      );
  }

  get balance(): Record<BalanceType, Record<moneyId, IBalance>> {
    return this.items.reduce<Record<BalanceType, Record<moneyId, IBalance>>>(
      (acc, { category, sign, amount, money }) => {
        const balanceType: BalanceType | undefined = balanceTypeMap[category.categoryPrototype!.id];
        if (!balanceType) {
          return acc;
        }
        acc[balanceType][money.id] = acc[balanceType][money.id] || { amount: 0, money };
        acc[balanceType][money.id].amount += sign * amount;

        switch (balanceType) {
          case 'debt':
            acc.unpaidDebt[money.id] = acc.unpaidDebt[money.id] || { amount: 0, money };
            acc.unpaidDebt[money.id].amount += sign * amount;
            break;
          case 'paidDebt':
            acc.unpaidDebt[money.id] = acc.unpaidDebt[money.id] || { amount: 0, money };
            acc.unpaidDebt[money.id].amount += sign * amount;
            break;
          case 'fee':
          case 'fine':
          case 'paidInterest':
            acc.cost[money.id] = acc.cost[money.id] || { amount: 0, money };
            acc.cost[money.id].amount += sign * amount;
            break;
        }

        return acc;
      },
      {
        debt: {},
        paidDebt: {},
        unpaidDebt: {},
        paidInterest: {},
        fee: {},
        fine: {},
        cost: {},
      }
    );
  }

  get debtItemsByDates(): IDebtItemsByDate[] {
    const map: Map<string, DebtItem[]> = new Map();
    this.debtItems.forEach(debtItem => {
      const date = format(parseISO(debtItem.debtItemDate), 'yyyy-MM-dd');
      const item = map.get(date);
      if (!item) {
        map.set(date, [debtItem]);
      } else {
        item.push(debtItem);
      }
    });

    return Array.from(map, ([date, debtItems]) => ({ date, debtItems }));
  }

  get debtDate(): TDateTime {
    const maxDate = Math.max(...this.items.map(({ debtItemDate }) => parseISO(debtItemDate).getTime()));
    if (maxDate !== -Infinity) {
      return new Date(maxDate).toISOString();
    }

    return this.updatedAt;
  }
}
