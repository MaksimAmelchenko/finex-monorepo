import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { SubscriptionStatus } from '../../../../modules/billing/subscription/types';
import { paypalService } from '../../../../modules/billing/paypal/paypal.service';
import { paymentService } from '../../../../modules/billing/payment/payment.service';
import { yookassaService } from '../../../../modules/billing/yookassa/yookassa.service';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(
  ctx: IRequestContext<{ subscriptionId: string }, true>
): Promise<IResponse<{ status: SubscriptionStatus }>> {
  const {
    userId,
    params: { subscriptionId },
  } = ctx;

  let subscription = await subscriptionService.getSubscription(ctx, userId, subscriptionId);

  if (subscription.status === SubscriptionStatus.Pending) {
    switch (subscription.gateway) {
      case 'yookassa': {
        let payment = await paymentService.getInitPayment(ctx, userId, subscription.id);
        const yookassaPayment = await yookassaService.getPayment(ctx, userId, payment.gatewayPaymentId!);

        payment = await paymentService.updatePayment(ctx, userId, payment.id, {
          status: yookassaPayment.status,
          gatewayResponse: yookassaPayment,
        });

        if (yookassaPayment.status === 'succeeded') {
          await subscriptionService.cancelSubscription(ctx, userId);
          subscription = await subscriptionService.updateSubscription(ctx, userId, subscriptionId, {
            status: SubscriptionStatus.Active,
            gatewayMetadata: {
              paymentMethodId: yookassaPayment.payment_method.id,
            },
          });
        }
        break;
      }
      case 'paypal': {
        const gatewaySubscriptionId = subscription.gatewaySubscriptionId!;
        const paypalSubscription = await paypalService.getSubscription(ctx.log, gatewaySubscriptionId);

        if (paypalSubscription.status === 'ACTIVE') {
          await subscriptionService.cancelSubscription(ctx, userId);
          subscription = await subscriptionService.updateSubscription(ctx, userId, subscriptionId, {
            status: SubscriptionStatus.Active,
          });

          await subscriptionService.syncPayPalPayments(ctx, userId, subscriptionId);
        }

        break;
      }
    }
  }

  return {
    body: {
      status: subscription.status,
    },
  };
}
