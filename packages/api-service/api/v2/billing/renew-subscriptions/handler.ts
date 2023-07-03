import { StatusCodes } from 'http-status-codes';

import config from '../../../../libs/config';
import { ICreateSubscriptionResponse } from '../../../../modules/billing/subscription/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';
import { UnauthorizedError } from '../../../../libs/errors';

const secret = config.get('subscriptions:secret');

interface IParams {
  secret: string;
}

export async function handler(ctx: IRequestContext<IParams, false>): Promise<IResponse<ICreateSubscriptionResponse>> {
  console.log(secret, ctx.params.secret);
  if (ctx.params.secret !== secret) {
    throw new UnauthorizedError('Invalid secret');
  }

  await subscriptionService.renewSubscriptions(ctx);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
