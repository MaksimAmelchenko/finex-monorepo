import { CashFlowMapper, ICashFlow, ICashFlowDAO, ICashFlowDTO } from './types';
import { CashFlow } from './models/cash-flow';
import { ICashFlowItem } from '../cash-flow-item/types';
import { Permissions } from '../../types/app';
import { cashFlowItemMapper } from '../cash-flow-item/cash-flow-item.mapper';

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
