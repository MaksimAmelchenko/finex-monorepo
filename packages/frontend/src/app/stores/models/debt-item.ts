import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { IDebtItem } from '../../types/debt';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { Money } from './money';
import { Tag } from './tag';
import { User } from './user';

export class DebtItem implements IDebtItem, ISelectable, IDeletable {
  readonly id: string;
  debtId: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  debtItemDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: Tag[];
  user: User;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    debtId,
    id,
    sign,
    amount,
    money,
    category,
    account,
    debtItemDate,
    reportPeriod,
    note,
    tags,
    user,
    permit,
  }: IDebtItem) {
    this.debtId = debtId;
    this.id = id;
    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.debtItemDate = debtItemDate;
    this.reportPeriod = reportPeriod;
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
