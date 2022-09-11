import { IExchange, IExchangeEntity } from '../types';
import { TDate, TDateTime } from '../../../types/app';

export class Exchange implements IExchange {
  readonly userId: string;
  readonly id: string;
  amountSell: number;
  moneySellId: string;
  amountBuy: number;
  moneyBuyId: string;
  accountSellId: string;
  accountBuyId: string;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  exchangeDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;

  constructor({
    userId,
    id,
    amountSell,
    moneySellId,
    amountBuy,
    moneyBuyId,
    accountSellId,
    accountBuyId,
    exchangeDate,
    reportPeriod,
    fee,
    moneyFeeId,
    accountFeeId,
    note,
    tags,
    updatedAt,
  }: IExchangeEntity) {
    this.userId = userId;
    this.id = id;
    this.amountSell = amountSell;
    this.moneySellId = moneySellId;
    this.amountBuy = amountBuy;
    this.moneyBuyId = moneyBuyId;
    this.accountSellId = accountSellId;
    this.accountBuyId = accountBuyId;
    this.exchangeDate = exchangeDate;
    this.reportPeriod = reportPeriod;
    this.fee = fee;
    this.moneyFeeId = moneyFeeId;
    this.accountFeeId = accountFeeId;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;
  }
}
