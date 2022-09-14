import { ITransaction, ITransactionEntity } from '../types';
import { Permit, Sign, TDate } from '../../../types/app';

export class Transaction implements ITransaction {
  readonly id: string;
  readonly cashFlowId: string;
  readonly userId: string;
  sign: Sign;
  amount: number;
  moneyId: string;
  transactionDate: TDate;
  reportPeriod: TDate;
  accountId: string;
  contractorId: string | null;
  categoryId: string;
  quantity: number | null;
  unitId: string | null;
  isNotConfirmed: boolean;
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
    transactionDate,
    reportPeriod,
    accountId,
    contractorId,
    categoryId,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tags,
    permit,
  }: ITransactionEntity) {
    this.id = id;
    this.cashFlowId = cashFlowId;
    this.userId = userId;
    this.sign = sign;
    this.amount = amount;
    this.moneyId = moneyId;
    this.transactionDate = transactionDate;
    this.reportPeriod = reportPeriod;
    this.accountId = accountId;
    this.contractorId = contractorId;
    this.categoryId = categoryId;
    this.quantity = quantity;
    this.unitId = unitId;
    this.isNotConfirmed = isNotConfirmed;
    this.note = note;
    this.tags = tags;
    this.permit = permit;
  }
}
