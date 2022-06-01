import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IPlannedTransaction } from '../../types/income-expense-transaction';
import { Money } from './money';
import { Tag } from './tag';
import { Unit } from './unit';
import { User } from './user';

export class PlannedTransaction implements IPlannedTransaction, ISelectable, IDeletable {
  sign: Sign;
  amount: number;
  money: Money;
  category: Category;
  account: Account;
  contractor: Contractor | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: Tag[];
  permit: Permit;
  user: User;
  planId: string;
  nRepeat: number;
  colorMark: string;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    sign,
    amount,
    money,
    category,
    account,
    contractor,
    transactionDate,
    reportPeriod,
    unit,
    quantity,
    isNotConfirmed,
    note,
    tags,
    permit,
    user,
    planId,
    nRepeat,
    colorMark,
  }: IPlannedTransaction) {
    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.contractor = contractor;
    this.transactionDate = transactionDate;
    this.reportPeriod = reportPeriod;
    this.quantity = quantity;
    this.unit = unit;
    this.isNotConfirmed = isNotConfirmed;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.user = user;

    this.planId = planId;
    this.nRepeat = nRepeat;
    this.colorMark = colorMark;

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
