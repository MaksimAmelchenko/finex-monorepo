import { AccessPeriod } from './models/access-period';
import { IAccessPeriod, IAccessPeriodDAO, AccessPeriodMapper } from './types';

class AccessPeriodMapperImpl implements AccessPeriodMapper {
  toDomain({ id, userId, planId, startAt, endAt, createdAt, updatedAt }: IAccessPeriodDAO): IAccessPeriod {
    return new AccessPeriod({
      id,
      userId: String(userId),
      planId,
      startAt,
      endAt,
      createdAt,
      updatedAt,
    });
  }
}

export const accessPeriodMapper = new AccessPeriodMapperImpl();
