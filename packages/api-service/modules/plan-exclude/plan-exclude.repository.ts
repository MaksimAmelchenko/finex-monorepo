import { IRequestContext } from '../../types/app';
import { PlanExcludeDAO } from './models/plan-exclude-dao';

import { CreatePlanExcludeRepositoryData, IPlanExcludeDAO, PlanExcludeRepository } from './types';

class PlanExcludeRepositoryImpl implements PlanExcludeRepository {
  async createPlanExclude(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    planId: string,

    data: CreatePlanExcludeRepositoryData
  ): Promise<void> {
    ctx.log.trace({ data }, 'try to create plan exclusion');

    const { exclusionDate, actionType } = data;

    await PlanExcludeDAO.query(ctx.trx).insert({
      idProject: Number(projectId),
      idUser: Number(userId),
      idPlan: Number(planId),
      dexclude: exclusionDate,
      actionType,
    });
  }
}

export const planExcludeRepository = new PlanExcludeRepositoryImpl();
