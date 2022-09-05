import { ICashFlowItem, ICashFlowItemEntity } from '../types';
import { Permit, Sign, TDate } from '../../../types/app';

export class CashFlowItem implements ICashFlowItem {
  readonly id: string;
  readonly cashFlowId: string;
  readonly userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  cashFlowItemDate: string;
  reportPeriod: TDate;
  accountId: string;
  categoryId: string;
  note: string;
  tags: string[];
  permit: Permit;

  constructor({
    id,
    cashFlowId,
    userId,
    sign,
    amount,
    moneyId,
    cashFlowItemDate,
    reportPeriod,
    accountId,
    categoryId,
    note,
    tags,
    permit,
  }: ICashFlowItemEntity) {
    this.id = id;
    this.cashFlowId = cashFlowId;
    this.userId = userId;
    this.sign = sign;
    this.amount = amount;
    this.moneyId = moneyId;
    this.cashFlowItemDate = cashFlowItemDate;
    this.reportPeriod = reportPeriod;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
  }
}
