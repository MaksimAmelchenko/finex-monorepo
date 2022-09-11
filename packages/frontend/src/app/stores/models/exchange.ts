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
  amountSell: number;
  moneySell: Money;
  amountBuy: number;
  moneyBuy: Money;
  accountSell: Account;
  accountBuy: Account;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
  note: string;
  tags: Tag[];
  updatedAt: TDateTime;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    user,
    id,
    amountSell,
    moneySell,
    amountBuy,
    moneyBuy,
    accountSell,
    accountBuy,
    exchangeDate,
    reportPeriod,
    fee,
    moneyFee,
    accountFee,
    note,
    tags,
    updatedAt,
  }: IExchange) {
    this.user = user;
    this.id = id;
    this.amountSell = amountSell;
    this.moneySell = moneySell;
    this.amountBuy = amountBuy;
    this.moneyBuy = moneyBuy;
    this.accountSell = accountSell;
    this.accountBuy = accountBuy;
    this.exchangeDate = exchangeDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.moneyFee = moneyFee;
    this.accountFee = accountFee;
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
