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
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
  note: string;
  tags: string[];
  permit: Permit;
  contractorId: string | null;

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
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tags,
    permit,
    contractorId,
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
    this.quantity = quantity;
    this.unitId = unitId;
    this.isNotConfirmed = isNotConfirmed;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.contractorId = contractorId;
  }
}
