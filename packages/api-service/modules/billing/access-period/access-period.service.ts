import { IRequestContext } from '../../../types/app';
import { IAccessPeriod, AccessPeriodService, CreateAccessPeriodServiceData } from './types';
import { NotFoundError } from '../../../libs/errors';
import { accessPeriodMapper } from './access-period.mapper';
import { accessPeriodRepository } from './access-period.repository';
import { TUUid } from '../../../../frontend/src/app/types';

class AccessPeriodImpl implements AccessPeriodService {
  async getAccessPeriod(
    ctx: IRequestContext,
    userId: string,
    accessPeriodId: TUUid
  ): Promise<IAccessPeriod> {
    const accessPeriodDAO = await accessPeriodRepository.getAccessPeriod(ctx, userId, accessPeriodId);
    if (!accessPeriodDAO) {
      throw new NotFoundError('Access period not found');
    }

    return accessPeriodMapper.toDomain(accessPeriodDAO);
  }

  async createAccessPeriod(
    ctx: IRequestContext,
    userId: string,
    data: CreateAccessPeriodServiceData
  ): Promise<IAccessPeriod> {
    const accessPeriod = await accessPeriodRepository.createAccessPeriod(ctx, userId, data);

    return this.getAccessPeriod(ctx, userId, accessPeriod.id);
  }
}

export const accessPeriodService = new AccessPeriodImpl();
