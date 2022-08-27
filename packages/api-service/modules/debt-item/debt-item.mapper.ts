import { DebtItemMapper, IDebtItem, IDebtItemDAO, IDebtItemDTO } from './types';
import { Permissions } from '../../types/app';
import { DebtItem } from './models/debt-item';

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
      note,
      tags,
      userId,
    }: IDebtItemDAO,
    { accounts }: Permissions
  ): IDebtItem {
    return new DebtItem({
      id: String(id),
      debtId: String(cashflowId),
      sign,
      amount,
      moneyId: String(moneyId),
      categoryId: String(categoryId),
      accountId: String(accountId),
      debtItemDate: cashflowItemDate,
      reportPeriod,
      note: note || '',
      tags: tags ? tags.map(String) : [],
      permit: accounts[String(accountId)] || 0,
      userId: String(userId),
    });
  }
}

export const debtItemMapper = new DebtItemMapperImpl();
