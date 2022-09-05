import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { CancelPlanGatewayParams } from '../../types';

export async function cancelPlan(
  ctx: IRequestContext<unknown, true>,
  planId: string,
  params: CancelPlanGatewayParams
): Promise<void> {
  ctx.log.trace({ planId, params }, 'try to cancel plan');

  await dbRequest(ctx, 'cf.plan.cancel', {
    idPlan: Number(planId),
    dExclude: params.excludedDate,
  });

  ctx.log.info({ planId, params }, 'canceled plan');
}
