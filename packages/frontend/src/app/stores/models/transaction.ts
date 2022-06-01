import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { ITransaction } from '../../types/transaction';
import { Money } from './money';
import { Tag } from './tag';
import { Unit } from './unit';
import { User } from './user';

export class Transaction implements ITransaction, ISelectable, IDeletable {
  readonly id: string;
  readonly cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
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

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    id,
    cashFlowId,
    sign,
    amount,
    money,
    category,
    account,
    contractor,
    transactionDate,
    reportPeriod,
    quantity,
    unit,
    isNotConfirmed,
    note,
    tags,
    permit,
    user,
  }: ITransaction) {
    this.id = id;
    this.cashFlowId = cashFlowId;
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
