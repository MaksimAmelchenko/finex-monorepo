import { IPlannedTransaction, IPlannedTransactionEntity } from '../types';
import { Permit, Sign, TDate } from '../../../types/app';

export class PlannedTransaction implements IPlannedTransaction {
  planId: string;
  contractorId: string | null;
  markerColor: string;
  repetitionNumber: number;
  sign: Sign;
  amount: number;
  moneyId: string;
  accountId: string;
  categoryId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  quantity: number | null;
  unitId: string | null;
  note: string;
  tags: string[];
  userId: string;
  permit: Permit;

  constructor({
    planId,
    contractorId,
    markerColor,
    repetitionNumber,
    sign,
    amount,
    moneyId,
    accountId,
    categoryId,
    transactionDate,
    reportPeriod,
    quantity,
    unitId,
    note,
    tags,
    userId,
    permit,
  }: IPlannedTransactionEntity) {
    this.planId = planId;
    this.contractorId = contractorId;
    this.markerColor = markerColor;
    this.repetitionNumber = repetitionNumber;
    this.sign = sign;
    this.amount = amount;
    this.moneyId = moneyId;
    this.transactionDate = transactionDate;
    this.reportPeriod = reportPeriod;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.quantity = quantity;
    this.unitId = unitId;
    this.note = note;
    this.tags = tags;
    this.userId = userId;
    this.permit = permit;
  }
}
