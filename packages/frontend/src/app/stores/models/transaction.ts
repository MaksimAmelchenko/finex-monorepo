import { action, makeObservable, observable } from 'mobx';

import { Category } from './category';
import { IAccount } from '../../types/account';
import { IContractor } from '../../types/contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IMoney } from '../../types/money';
import { ITransaction } from '../../types/transaction';
import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';

export class Transaction implements ITransaction, ISelectable, IDeletable {
  readonly id: string;
  readonly cashFlowId: string;
  sign: Sign;
  amount: number;
  money: IMoney;
  account: IAccount;
  category: Category;
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
