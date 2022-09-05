import { CashFlowMapper, ICashFlow, ICashFlowDAO } from './types';
import { CashFlow } from './models/cashflow';

class CashFlowMapperImpl implements CashFlowMapper {
  toDomain({ userId, id, cashflowTypeId, contractorId, note, tags, updatedAt }: ICashFlowDAO): ICashFlow {
    return new CashFlow({
      id: String(id),
      cashFlowTypeId: cashflowTypeId,
      contractorId: contractorId ? String(userId) : null,
      userId: String(userId),
      note: note ?? '',
      tags: tags ? tags.map(String) : [],
      updatedAt,
    });
  }
}

export const cashFlowMapper = new CashFlowMapperImpl();
