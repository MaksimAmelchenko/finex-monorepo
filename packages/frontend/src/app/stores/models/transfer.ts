import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { IDeletable, ISelectable, TDate, TDateTime } from '../../types';
import { ITransfer } from '../../types/transfer';
import { Money } from './money';
import { Tag } from './tag';
import { User } from './user';

export class Transfer implements ITransfer, ISelectable, IDeletable {
  readonly id: string;
  user: User;
  amount: number;
  money: Money;
  fromAccount: Account;
  toAccount: Account;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoney: Money | null;
  feeAccount: Account | null;
  note: string;
  tags: Tag[];
  updatedAt: TDateTime;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    user,
    id,
    amount,
    money,
    fromAccount,
    toAccount,
    transferDate,
    reportPeriod,
    fee,
    feeMoney,
    feeAccount,
    note,
    tags,
    updatedAt,
  }: ITransfer) {
    this.user = user;
    this.id = id;
    this.amount = amount;
    this.money = money;
    this.fromAccount = fromAccount;
    this.toAccount = toAccount;
    this.transferDate = transferDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.feeMoney = feeMoney;
    this.feeAccount = feeAccount;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;

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
