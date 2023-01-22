import { IPlan, PlanService } from './types';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';
import { planMapper } from './plan.mapper';
import { planRepository } from './plan.repository';

class SubscriptionServiceImpl implements PlanService {
  async getPlan(ctx: IRequestContext, planId: string): Promise<IPlan> {
    const planDAO = await planRepository.getPlan(ctx, planId);
    if (!planDAO) {
      throw new NotFoundError('Plan not found');
    }

    return planMapper.toDomain(planDAO);
  }

  async getPlans(ctx: IRequestContext<unknown, true>): Promise<IPlan[]> {
    const planDAOs = await planRepository.getPlans(ctx);

    return planDAOs.map(planDAO => planMapper.toDomain(planDAO));
  }
}

export const planService = new SubscriptionServiceImpl();
