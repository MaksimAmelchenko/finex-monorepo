import { StatusCodes } from 'http-status-codes';

import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<INoContent> {
  const { userId } = ctx;
  await subscriptionService.cancelSubscription(ctx, userId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
