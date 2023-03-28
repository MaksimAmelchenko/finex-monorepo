import * as uuid from 'uuid';

import { AccessPeriodDAO } from './models/access-period-dao';
import { AccessPeriodRepository, CreateAccessPeriodRepositoryData, IAccessPeriodDAO } from './types';
import { IRequestContext } from '../../../types/app';

class AccessPeriodRepositoryImpl implements AccessPeriodRepository {
  async getAccessPeriod(
    ctx: IRequestContext,
    userId: string,
    accessPeriodId: string
  ): Promise<IAccessPeriodDAO | undefined> {
    ctx.log.trace({ accessPeriodId }, 'try to get access period');

    return AccessPeriodDAO.query(ctx.trx)
      .findById(accessPeriodId)
      .where({ userId: Number(userId) });
  }

  async createAccessPeriod(
    ctx: IRequestContext,
    userId: string,
    data: CreateAccessPeriodRepositoryData
  ): Promise<IAccessPeriodDAO> {
    ctx.log.trace({ data }, 'try to access period');

    const { planId, startAt, endAt } = data;

    const id = uuid.v4();

    const accessPeriodDAO = await AccessPeriodDAO.query(ctx.trx).insert({
      id,
      userId: Number(userId),
      planId,
      startAt,
      endAt,
    });

    ctx.log.info({ accessPeriodId: accessPeriodDAO.id }, 'created access period');

    return (await this.getAccessPeriod(ctx, userId, accessPeriodDAO.id)) as IAccessPeriodDAO;
  }
}

export const accessPeriodRepository = new AccessPeriodRepositoryImpl();
