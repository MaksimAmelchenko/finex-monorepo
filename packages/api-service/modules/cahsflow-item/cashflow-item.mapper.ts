import { CashFlowItem } from './models/cashflow-item';
import { CashFlowItemMapper, ICashFlowItem, ICashFlowItemDAO } from './types';
import { ICashFlowItemDTO } from '../cahsflow/types';
import { Permissions } from '../../types/app';

class CashFlowItemMapperImpl implements CashFlowItemMapper {
  toDomain(
    {
      id,
      cashflowId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      cashflowItemDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
      userId,
    }: ICashFlowItemDAO,
    { accounts }: Permissions
  ): ICashFlowItem {
    return new CashFlowItem({
      id: String(id),
      cashFlowId: String(cashflowId),
      sign,
      amount,
      moneyId: String(moneyId),
      categoryId: String(categoryId),
      accountId: String(accountId),
      cashFlowItemDate: cashflowItemDate,
      reportPeriod,
      permit: accounts[String(accountId)] || 0,
      userId: String(userId),
      quantity,
      unitId: unitId ? String(unitId) : null,
      isNotConfirmed,
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
    });
  }

  toDTO({
    id,
    sign,
    amount,
    moneyId,
    categoryId,
    accountId,
    cashFlowItemDate,
    reportPeriod,
    quantity,
    unitId,
    isNotConfirmed,
    note,
    tags,
    permit,
    cashFlowId,
    userId,
  }: ICashFlowItem): ICashFlowItemDTO {
    return {
      id,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      cashFlowItemDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags,
      permit,
      cashFlowId,
      userId,
    };
  }
}

export const cashFlowItemMapper = new CashFlowItemMapperImpl();
