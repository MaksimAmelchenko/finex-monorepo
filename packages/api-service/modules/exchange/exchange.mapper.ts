import { ICashFlowDAO } from '../cash-flow/types';
import { ICashFlowItemDAO } from '../cash-flow-item/types';
import { InternalError } from '../../libs/errors';
import { Exchange } from './model/exchange';
import { ExchangeMapper, IExchange, IExchangeDTO } from './types';

class ExchangeMapperImpl implements ExchangeMapper {
  toDTO({
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
  }: IExchange): IExchangeDTO {
    return {
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
      userId,
    };
  }

  toDomain(
    { userId, id, note, tags, updatedAt }: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    exchangeCategoryId: string,
    exchangeFeeCategoryId: string
  ): IExchange {
    let sellAmount: number | undefined;
    let sellMoneyId: string | undefined;
    let buyAmount: number | undefined;
    let buyMoneyId: string | undefined;
    let sellAccountId: string | undefined;
    let buyAccountId: string | undefined;
    let fee: number | null = null;
    let feeMoneyId: string | null = null;
    let feeAccountId: string | null = null;
    let exchangeDate: string | undefined;
    let reportPeriod: string | undefined;

    for (const cashFlowItem of cashFlowItems) {
      if (String(cashFlowItem.categoryId) === exchangeCategoryId && cashFlowItem.sign === -1) {
        sellAmount = cashFlowItem.amount;
        sellMoneyId = String(cashFlowItem.moneyId);
        sellAccountId = String(cashFlowItem.accountId);
        exchangeDate = cashFlowItem.cashflowItemDate;
        reportPeriod = cashFlowItem.reportPeriod;
      }

      if (String(cashFlowItem.categoryId) === exchangeCategoryId && cashFlowItem.sign === 1) {
        buyAmount = cashFlowItem.amount;
        buyMoneyId = String(cashFlowItem.moneyId);
        buyAccountId = String(cashFlowItem.accountId);
      }

      if (String(cashFlowItem.categoryId) === exchangeFeeCategoryId) {
        fee = cashFlowItem.amount;
        feeMoneyId = String(cashFlowItem.moneyId);
        feeAccountId = String(cashFlowItem.accountId);
      }
    }

    if (
      !sellAmount ||
      !sellMoneyId ||
      !buyAmount ||
      !buyMoneyId ||
      !sellAccountId ||
      !buyAccountId ||
      !exchangeDate ||
      !reportPeriod
    ) {
      throw new InternalError('Exchange record is corrupted');
    }

    return new Exchange({
      userId: String(userId),
      id: String(id),
      sellAmount,
      sellMoneyId,
      buyAmount,
      buyMoneyId,
      sellAccountId,
      buyAccountId,
      fee,
      feeMoneyId,
      feeAccountId,
      exchangeDate,
      reportPeriod,
      note: note || '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }
}

export const exchangeMapper = new ExchangeMapperImpl();
