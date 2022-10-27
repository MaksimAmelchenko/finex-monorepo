import { DebtItem } from './models/debt-item';
import { DebtItemMapper, IDebtItem, IDebtItemDTO } from './types';
import { ICashFlowItem } from '../cash-flow-item/types';

class DebtItemMapperImpl implements DebtItemMapper {
  toDTO({
    id,
    debtId,
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
    userId,
  }: IDebtItem): IDebtItemDTO {
    return {
      id,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      debtItemDate,
      reportPeriod,
      note,
      tags,
      permit,
      debtId,
      userId,
    };
  }

  toDomain({
    id,
    cashFlowId,
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    cashFlowItemDate,
    reportPeriod,
    note,
    tags,
    userId,
    permit,
  }: ICashFlowItem): IDebtItem {
    return new DebtItem({
      id,
      debtId: cashFlowId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      debtItemDate: cashFlowItemDate,
      reportPeriod,
      note,
      tags,
      permit,
      userId,
    });
  }
}

export const debtItemMapper = new DebtItemMapperImpl();
