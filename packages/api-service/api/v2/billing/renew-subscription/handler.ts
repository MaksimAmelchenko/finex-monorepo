import { StatusCodes } from 'http-status-codes';

import { ICreateSubscriptionResponse } from '../../../../modules/billing/subscription/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<ICreateSubscriptionResponse>> {
  const { userId } = ctx;
  await subscriptionService.renewSubscription(ctx, userId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
