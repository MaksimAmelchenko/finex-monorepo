import { ITransfer, ITransferEntity } from '../types';
import { TDate, TDateTime } from '../../../types/app';

export class Transfer implements ITransfer {
  readonly userId: string;
  readonly id: string;
  amount: number;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  transferDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;

  constructor({
    userId,
    id,
    amount,
    moneyId,
    fromAccountId,
    toAccountId,
    transferDate,
    reportPeriod,
    fee,
    feeMoneyId,
    feeAccountId,
    note,
    tags,
    updatedAt,
  }: ITransferEntity) {
    this.userId = userId;
    this.id = id;
    this.amount = amount;
    this.moneyId = moneyId;
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.transferDate = transferDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.feeMoneyId = feeMoneyId;
    this.feeAccountId = feeAccountId;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;
  }
}
