import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IPlannedTransaction } from '../../types/transaction';
import { Money } from './money';
import { Tag } from './tag';
import { Unit } from './unit';
import { User } from './user';

export class PlannedTransaction implements IPlannedTransaction, ISelectable, IDeletable {
  planId: string;
  contractor: Contractor | null;
  repetitionNumber: number;
  markerColor: string;

  sign: Sign;
  amount: number;
  money: Money;
  category: Category;
  account: Account;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: Unit | null;
  note: string;
  tags: Tag[];
  permit: Permit;
  user: User;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    planId,
    contractor,
    repetitionNumber,
    markerColor,
    sign,
    amount,
    money,
    category,
    account,
    transactionDate,
    reportPeriod,
    unit,
    quantity,
    note,
    tags,
    permit,
    user,
  }: IPlannedTransaction) {
    this.planId = planId;
    this.repetitionNumber = repetitionNumber;
    this.markerColor = markerColor;
    this.contractor = contractor;

    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.transactionDate = transactionDate;
    this.reportPeriod = reportPeriod;
    this.quantity = quantity;
    this.unit = unit;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.user = user;

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
