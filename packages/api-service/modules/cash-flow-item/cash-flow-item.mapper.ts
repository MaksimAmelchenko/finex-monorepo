import { CashFlowItem } from './models/cash-flow-item';
import { CashFlowItemMapper, ICashFlowItem, ICashFlowItemDAO } from './types';
import { ICashFlowItemDTO } from '../cash-flow/types';
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
      contractorId,
    }: ICashFlowItemDAO,
    { accounts }: Permissions
  ): ICashFlowItem {
    return new CashFlowItem({
      id: String(id),
      cashFlowId: String(cashflowId),
      sign,
      amount,
      moneyId: String(moneyId),
      categoryId: categoryId ? String(categoryId) : null,
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
      contractorId: contractorId ? String(contractorId) : null,
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
