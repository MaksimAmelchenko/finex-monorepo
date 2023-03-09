import { action, makeObservable, observable } from 'mobx';

import { Account } from './account';
import { Category } from './category';
import { Contractor } from './contractor';
import { Exchange } from './exchange';
import { IDeletable, ISelectable, Permit, Sign, TDate } from '../../types';
import { IOperationDebt, IOperationExchange, IOperationTransaction, IOperationTransfer } from '../../types/operation';
import { Money } from './money';
import { Tag } from './tag';
import { Transaction } from './transaction';
import { Transfer } from './transfer';
import { User } from './user';

export class OperationTransaction extends Transaction implements IOperationTransaction {
  constructor(entity: Omit<IOperationTransaction, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.transactionDate;
  }
}

export class OperationDebt implements IOperationDebt, ISelectable, IDeletable {
  readonly id: string;
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

  get operationDate(): TDate {
    return this.debtItemDate;
  }
}

export class OperationTransfer extends Transfer implements IOperationTransfer {
  constructor(entity: Omit<IOperationTransfer, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.transferDate;
  }
}

export class OperationExchange extends Exchange implements IOperationExchange {
  constructor(entity: Omit<IOperationExchange, 'operationDate'>) {
    super(entity);
  }

  get operationDate(): TDate {
    return this.exchangeDate;
  }
}
