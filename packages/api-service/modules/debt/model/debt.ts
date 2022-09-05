import { IDebt, IDebtEntity } from '../types';
import { TDateTime } from '../../../types/app';
import { DebtItem } from '../../debt-item/models/debt-item';
import { IDebtItem } from '../../debt-item/types';

export class Debt implements IDebt {
  readonly userId: string;
  readonly id: string;
  contractorId: string;
  note: string;
  tags: string[];
  items: IDebtItem[];
  updatedAt: TDateTime;

  constructor({ userId, id, contractorId, note, tags, items, updatedAt }: IDebtEntity) {
    this.userId = userId;
    this.id = id;
    this.contractorId = contractorId;
    this.note = note;
    this.tags = tags;
    this.items = items.map(item => new DebtItem(item));
    this.updatedAt = updatedAt;
  }
}
