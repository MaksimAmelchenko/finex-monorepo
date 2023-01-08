import { ICreateSubscriptionResponse } from '../../../../modules/billing/subscription/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { PaymentGateway } from '../../../../modules/billing/payment/types';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(
  ctx: IRequestContext<{ gateway: PaymentGateway; planId: string }, true>
): Promise<IResponse<ICreateSubscriptionResponse>> {
  const {
    params: { gateway, planId },
    userId,
  } = ctx;
  const response = await subscriptionService.createSubscription(ctx, userId, gateway, planId);

  return {
    body: response,
  };
}
