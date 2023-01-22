import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(
  ctx: IRequestContext<{ subscriptionId: string; gatewaySubscriptionId: string }, true>
): Promise<INoContent> {
  const {
    userId,
    params: { subscriptionId, gatewaySubscriptionId },
  } = ctx;

  await subscriptionService.updateSubscription(ctx, userId, subscriptionId, {
    gatewaySubscriptionId,
  });

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
