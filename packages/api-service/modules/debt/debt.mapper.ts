import { Debt } from './model/debt';
import { DebtMapper, IDebt, IDebtDTO } from './types';
import { ICashFlowDAO } from '../cahsflow/types';
import { IDebtItem } from '../debt-item/types';
import { Permissions } from '../../types/app';
import { debtItemMapper } from '../debt-item/debt-item.mapper';

class DebtMapperImpl implements DebtMapper {
  toDTO({ userId, id, contractorId, note, tags, items, updatedAt }: IDebt): IDebtDTO {
    return {
      id,
      contractorId,
      note,
      tags,
      items: items.map(item => debtItemMapper.toDTO(item)),
      updatedAt,
      userId,
    };
  }

  toDomain(
    { projectId, userId, id, contractorId, note, tags, updatedAt }: ICashFlowDAO,
    debtItems: IDebtItem[],
    permissions: Permissions
  ): IDebt {
    return new Debt({
      userId: String(userId),
      id: String(id),
      contractorId: String(contractorId),
      note: note || '',
      tags: tags ? tags.map(String) : [],
      items: debtItems,
      updatedAt,
    });
  }
}

export const debtMapper = new DebtMapperImpl();
