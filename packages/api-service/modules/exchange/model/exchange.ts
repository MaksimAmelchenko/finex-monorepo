import { IExchange, IExchangeEntity } from '../types';
import { TDate, TDateTime } from '../../../types/app';

export class Exchange implements IExchange {
  readonly userId: string;
  readonly id: string;
  sellAmount: number;
  sellMoneyId: string;
  buyAmount: number;
  buyMoneyId: string;
  sellAccountId: string;
  buyAccountId: string;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  exchangeDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;

  constructor({
    userId,
    id,
    sellAmount,
    sellMoneyId,
    buyAmount,
    buyMoneyId,
    sellAccountId,
    buyAccountId,
    exchangeDate,
    reportPeriod,
    fee,
    feeMoneyId,
    feeAccountId,
    note,
    tags,
    updatedAt,
  }: IExchangeEntity) {
    this.userId = userId;
    this.id = id;
    this.sellAmount = sellAmount;
    this.sellMoneyId = sellMoneyId;
    this.buyAmount = buyAmount;
    this.buyMoneyId = buyMoneyId;
    this.sellAccountId = sellAccountId;
    this.buyAccountId = buyAccountId;
    this.exchangeDate = exchangeDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.feeMoneyId = feeMoneyId;
    this.feeAccountId = feeAccountId;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;
  }
}
