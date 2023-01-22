import { IPlanDTO } from '../../../../modules/billing/plan/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { planMapper } from '../../../../modules/billing/plan/plan.mapper';
import { planService } from '../../../../modules/billing/plan/plan.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ plans: IPlanDTO[] }>> {
  const { locale } = ctx.params;

  const plans = await planService.getPlans(ctx);

  return {
    body: {
      plans: plans.map(plan => planMapper.toDTO(plan, locale)),
    },
  };
}
