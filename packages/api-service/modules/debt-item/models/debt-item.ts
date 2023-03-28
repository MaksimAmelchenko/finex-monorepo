import { IDebtItem, IDebtItemEntity } from '../types';
import { Permit, Sign, TDate } from '../../../types/app';

export class DebtItem implements IDebtItem {
  readonly id: string;
  readonly debtId: string;
  readonly userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  debtItemDate: TDate;
  reportPeriod: TDate;
  accountId: string;
  categoryId: string;
  note: string;
  tags: string[];
  permit: Permit;
  contractorId: string;

  constructor({
    id,
    debtId,
    userId,
    sign,
    amount,
    moneyId,
    debtItemDate,
    reportPeriod,
    accountId,
    categoryId,
    note,
    tags,
    permit,
    contractorId
  }: IDebtItemEntity) {
    this.id = id;
    this.debtId = debtId;
    this.userId = userId;
    this.sign = sign;
    this.amount = amount;
    this.moneyId = moneyId;
    this.debtItemDate = debtItemDate;
    this.reportPeriod = reportPeriod;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
    this.contractorId = contractorId;
  }
}
