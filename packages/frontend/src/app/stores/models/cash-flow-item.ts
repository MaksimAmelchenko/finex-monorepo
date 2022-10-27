import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { ICashFlowItem } from '../../types/cash-flow';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { Money } from './money';
import { Tag } from './tag';
import { Unit } from './unit';
import { User } from './user';

export class CashFlowItem implements ICashFlowItem, ISelectable, IDeletable {
  readonly id: string;
  cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  cashFlowItemDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: Tag[];
  user: User;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    cashFlowId,
    id,
    sign,
    amount,
    money,
    category,
    account,
    cashFlowItemDate,
    reportPeriod,
    quantity,
    unit,
    isNotConfirmed,
    note,
    tags,
    user,
    permit,
  }: ICashFlowItem) {
    this.cashFlowId = cashFlowId;
    this.id = id;
    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.cashFlowItemDate = cashFlowItemDate;
    this.reportPeriod = reportPeriod;
    this.quantity = quantity;
    this.unit = unit;
    this.isNotConfirmed = isNotConfirmed;
    this.note = note;
    this.tags = tags;
    this.user = user;
    this.isDeleting = false;
    this.isSelected = false;
    this.permit = permit;

    makeObservable(this, {
      isDeleting: observable,
      isSelected: observable,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  permit: Permit;
}
