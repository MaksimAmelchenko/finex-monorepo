import { CashFlowMapper, ICashFlow, ICashFlowDAO, ICashFlowDTO } from './types';
import { CashFlow } from './models/cashflow';
import { IDebtItem } from '../debt-item/types';
import { Permissions } from '../../types/app';
import { ICashFlowItem } from '../cahsflow-item/types';
import { IDebt, IDebtDTO } from '../debt/types';
import { debtItemMapper } from '../debt-item/debt-item.mapper';
import { cashFlowItemMapper } from '../cahsflow-item/cashflow-item.mapper';

class CashFlowMapperImpl implements CashFlowMapper {
  toDomain(
    { userId, id, cashflowTypeId, contractorId, note, tags, updatedAt }: ICashFlowDAO,
    cashFlowItems: ICashFlowItem[],
    permissions: Permissions
  ): ICashFlow {
    return new CashFlow({
      id: String(id),
      cashFlowTypeId: cashflowTypeId,
      contractorId: contractorId ? String(contractorId) : null,
      items: cashFlowItems,
      userId: String(userId),
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }

  toDTO({ userId, id, contractorId, note, tags, items, updatedAt }: ICashFlow): ICashFlowDTO {
    return {
      id,
      contractorId,
      note,
      tags,
      items: items.map(item => cashFlowItemMapper.toDTO(item)),
      updatedAt,
      userId,
    };
  }
}

export const cashFlowMapper = new CashFlowMapperImpl();
