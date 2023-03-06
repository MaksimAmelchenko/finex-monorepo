import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IOperationDebt, IOperationExchange, IOperationTransaction, IOperationTransfer } from '../../types/operation';
import { Money } from './money';
import { Tag } from './tag';
import { Unit } from './unit';
import { User } from './user';

export class OperationTransaction implements IOperationTransaction, ISelectable, IDeletable {
  readonly id: string;
  readonly operationDate: TDate;
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
  }: Omit<IOperationTransaction, 'operationDate'>) {
    this.id = id;
    this.operationDate = transactionDate;
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

export class OperationDebt implements IOperationDebt, ISelectable, IDeletable {
  readonly id: string;
  readonly operationDate: TDate;
  readonly cashFlowId: string;
  sign: Sign;
  amount: number;
  money: Money;
  account: Account;
  category: Category;
  contractor: Contractor;
  debtItemDate: TDate;
  reportPeriod: TDate;
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
    debtItemDate,
    reportPeriod,
    note,
    tags,
    permit,
    user,
  }: Omit<IOperationDebt, 'operationDate'>) {
    this.id = id;
    this.operationDate = debtItemDate;
    this.cashFlowId = cashFlowId;
    this.sign = sign;
    this.amount = amount;
    this.money = money;
    this.category = category;
    this.account = account;
    this.contractor = contractor;
    this.debtItemDate = debtItemDate;
    this.reportPeriod = reportPeriod;
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

export class OperationTransfer implements IOperationTransfer, ISelectable, IDeletable {
  readonly id: string;
  readonly operationDate: TDate;
  amount: number;
  money: Money;
  accountFrom: Account;
  accountTo: Account;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
  note: string;
  tags: Tag[];
  user: User;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    id,
    amount,
    money,
    accountFrom,
    accountTo,
    transferDate,
    reportPeriod,
    fee,
    moneyFee,
    accountFee,
    note,
    tags,
    user,
  }: Omit<IOperationTransfer, 'operationDate'>) {
    this.id = id;
    this.operationDate = transferDate;
    this.amount = amount;
    this.money = money;
    this.accountFrom = accountFrom;
    this.accountTo = accountTo;
    this.transferDate = transferDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.moneyFee = moneyFee;
    this.accountFee = accountFee;
    this.note = note;
    this.tags = tags;
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

export class OperationExchange implements IOperationExchange, ISelectable, IDeletable {
  readonly id: string;
  readonly operationDate: TDate;

  sellAmount: number;
  moneySell: Money;
  accountSell: Account;
  buyAmount: number;
  moneyBuy: Money;
  accountBuy: Account;
  exchangeDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
  note: string;
  tags: Tag[];
  user: User;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({
    id,
    sellAmount,
    moneySell,
    accountSell,
    buyAmount,
    moneyBuy,
    accountBuy,
    exchangeDate,
    reportPeriod,
    fee,
    moneyFee,
    accountFee,
    note,
    tags,
    user,
  }: Omit<IOperationExchange, 'operationDate'>) {
    this.id = id;
    this.operationDate = exchangeDate;
    this.sellAmount = sellAmount;
    this.moneySell = moneySell;
    this.accountSell = accountSell;
    this.buyAmount = buyAmount;
    this.moneyBuy = moneyBuy;
    this.accountBuy = accountBuy;
    this.exchangeDate = exchangeDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.moneyFee = moneyFee;
    this.accountFee = accountFee;
    this.note = note;
    this.tags = tags;
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