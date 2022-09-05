import { CashFlowType, ICashFlow, ICashFlowEntity } from '../types';
import { TDateTime } from '../../../types/app';

export class CashFlow implements ICashFlow {
  readonly id: string;
  readonly userId: string;
  cashFlowTypeId: CashFlowType;
  contractorId: string | null;
  note: string;
  tags: string[];
  updatedAt: TDateTime;

  constructor({ id, userId, cashFlowTypeId, contractorId, note, tags, updatedAt }: ICashFlowEntity) {
    this.id = id;
    this.userId = userId;
    this.cashFlowTypeId = cashFlowTypeId;
    this.contractorId = contractorId;
    this.note = note;
    this.tags = tags;
    this.updatedAt = updatedAt;
  }
}
