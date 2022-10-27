import { ICashFlowDAO } from '../cash-flow/types';
import { ICashFlowItemDAO } from '../cash-flow-item/types';
import { InternalError } from '../../libs/errors';
import { Exchange } from './model/exchange';
import { ExchangeMapper, IExchange, IExchangeDTO } from './types';

class ExchangeMapperImpl implements ExchangeMapper {
  toDTO({
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
  }: IExchange): IExchangeDTO {
    return {
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
      userId,
    };
  }

  toDomain(
    { userId, id, note, tags, updatedAt }: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    exchangeCategoryId: string,
    exchangeFeeCategoryId: string
  ): IExchange {
    let amountSell: number | undefined;
    let moneySellId: string | undefined;
    let amountBuy: number | undefined;
    let moneyBuyId: string | undefined;
    let accountSellId: string | undefined;
    let accountBuyId: string | undefined;
    let fee: number | null = null;
    let moneyFeeId: string | null = null;
    let accountFeeId: string | null = null;
    let exchangeDate: string | undefined;
    let reportPeriod: string | undefined;

    for (const cashFlowItem of cashFlowItems) {
      if (String(cashFlowItem.categoryId) === exchangeCategoryId && cashFlowItem.sign === -1) {
        amountSell = cashFlowItem.amount;
        moneySellId = String(cashFlowItem.moneyId);
        accountSellId = String(cashFlowItem.accountId);
        exchangeDate = cashFlowItem.cashflowItemDate;
        reportPeriod = cashFlowItem.reportPeriod;
      }

      if (String(cashFlowItem.categoryId) === exchangeCategoryId && cashFlowItem.sign === 1) {
        amountBuy = cashFlowItem.amount;
        moneyBuyId = String(cashFlowItem.moneyId);
        accountBuyId = String(cashFlowItem.accountId);
      }

      if (String(cashFlowItem.categoryId) === exchangeFeeCategoryId) {
        fee = cashFlowItem.amount;
        moneyFeeId = String(cashFlowItem.moneyId);
        accountFeeId = String(cashFlowItem.accountId);
      }
    }

    if (
      !amountSell ||
      !moneySellId ||
      !amountBuy ||
      !moneyBuyId ||
      !accountSellId ||
      !accountBuyId ||
      !exchangeDate ||
      !reportPeriod
    ) {
      throw new InternalError('Exchange record is corrupted');
    }

    return new Exchange({
      userId: String(userId),
      id: String(id),
      amountSell,
      moneySellId,
      amountBuy,
      moneyBuyId,
      accountSellId,
      accountBuyId,
      fee,
      moneyFeeId,
      accountFeeId,
      exchangeDate,
      reportPeriod,
      note: note || '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }
}

export const exchangeMapper = new ExchangeMapperImpl();
