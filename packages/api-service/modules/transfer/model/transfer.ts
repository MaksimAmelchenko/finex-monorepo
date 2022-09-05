import { ITransfer, ITransferEntity } from '../types';
import { TDate, TDateTime } from '../../../types/app';

export class Transfer implements ITransfer {
  readonly userId: string;
  readonly id: string;
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
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
    accountFromId,
    accountToId,
    transferDate,
    reportPeriod,
    fee,
    moneyFeeId,
    accountFeeId,
    note,
    tags,
    updatedAt,
  }: ITransferEntity) {
    this.userId = userId;
    this.id = id;
    this.amount = amount;
    this.moneyId = moneyId;
    this.accountFromId = accountFromId;
    this.accountToId = accountToId;
    this.transferDate = transferDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.moneyFeeId = moneyFeeId;
    this.accountFeeId = accountFeeId;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;
  }
}
