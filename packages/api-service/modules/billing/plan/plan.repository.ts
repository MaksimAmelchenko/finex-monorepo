import { IPlanDAO, PlanRepository } from './types';
import { IRequestContext } from '../../../types/app';
import { PlanDAO } from './models/plan-dao';

class PlanRepositoryImpl implements PlanRepository {
  async getPlan(ctx: IRequestContext, planId: string): Promise<IPlanDAO | undefined> {
    ctx.log.trace({ planId }, 'try to get plan');

    return PlanDAO.query(ctx.trx).findById(planId);
  }

  async getPlans(ctx: IRequestContext<unknown, true>): Promise<IPlanDAO[]> {
    ctx.log.trace('try to get plans');

    return PlanDAO.query(ctx.trx);
  }
}

export const planRepository = new PlanRepositoryImpl();
