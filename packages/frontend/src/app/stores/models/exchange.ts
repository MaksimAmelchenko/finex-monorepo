import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { IDeletable, ISelectable, TDate, TDateTime } from '../../types';
import { IExchange } from '../../types/exchange';
import { Money } from './money';
import { Tag } from './tag';
import { User } from './user';

export class Exchange implements IExchange, ISelectable, IDeletable {
  readonly id: string;
  user: User;
  sellAmount: number;
  sellMoney: Money;
  buyAmount: number;
  buyMoney: Money;
  sellAccount: Account;
  buyAccount: Account;
  exchangeDate: TDate;
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
    sellAmount,
    sellMoney,
    buyAmount,
    buyMoney,
    sellAccount,
    buyAccount,
    exchangeDate,
    reportPeriod,
    fee,
    feeMoney,
    feeAccount,
    note,
    tags,
    updatedAt,
  }: IExchange) {
    this.user = user;
    this.id = id;
    this.sellAmount = sellAmount;
    this.sellMoney = sellMoney;
    this.buyAmount = buyAmount;
    this.buyMoney = buyMoney;
    this.sellAccount = sellAccount;
    this.buyAccount = buyAccount;
    this.exchangeDate = exchangeDate;
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
