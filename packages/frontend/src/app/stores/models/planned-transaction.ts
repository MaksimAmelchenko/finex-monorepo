import { action, makeObservable, observable } from 'mobx';

import { Category } from './category';
import { IAccount } from '../../types/account';
import { IContractor } from '../../types/contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IMoney } from '../../types/money';
import { IPlannedTransaction } from '../../types/income-expense-transaction';
import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';

export class PlannedTransaction implements IPlannedTransaction, ISelectable, IDeletable {
  sign: Sign;
  amount: number;
  money: IMoney;
  category: Category;
  account: IAccount;
  contractor: IContractor | null;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unit: IUnit | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
  user: IUser;
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
