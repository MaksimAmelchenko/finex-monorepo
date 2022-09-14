import { CashFlowItemMapper, ICashFlowItem, ICashFlowItemDAO } from './types';
import { Permissions } from '../../types/app';
import { CashFlowItem } from './models/cashflow-item';

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
}

export const cashflowItemMapper = new CashFlowItemMapperImpl();
