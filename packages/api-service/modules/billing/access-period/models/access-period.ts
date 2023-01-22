import { IAccessPeriod, IAccessPeriodEntity } from '../types';
import { TDateTime } from '../../../../types/app';

export class AccessPeriod implements IAccessPeriod {
  id: string;
  userId: string;
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor({ id, userId, planId, startAt, endAt, createdAt, updatedAt }: IAccessPeriodEntity) {
    this.id = id;
    this.userId = userId;
    this.planId = planId;
    this.startAt = startAt;
    this.endAt = endAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
