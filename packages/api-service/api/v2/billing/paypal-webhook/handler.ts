import config from '../../../../libs/config';
import { IRequestContext } from '../../../../types/app';
import { paypalService } from '../../../../modules/billing/paypal/paypal.service';
import { subscriptionRepository } from '../../../../modules/billing/subscription/subscription.repository';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';
import { InternalError } from '../../../../libs/errors';

const { webhookId } = config.get('paypal');

export async function handler(ctx: IRequestContext<any>): Promise<any> {
  const { headers, body } = ctx.additionalParams;

  const { verification_status } = await paypalService.verifyWebhookSignature(ctx.log, {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_event: body,
    webhook_id: webhookId,
  });

  if (verification_status === 'SUCCESS') {
    const { event_type } = ctx.params;
    switch (event_type) {
      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        const { custom_id } = ctx.params.resource;

        const subscriptionDAO = await subscriptionRepository.getSubscriptionById(ctx, custom_id);
        if (subscriptionDAO) {
          await subscriptionService.cancelSubscription(ctx, String(subscriptionDAO.userId));
        }
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        const { billing_agreement_id: gatewaySubscriptionId } = ctx.params.resource;
        const subscriptionDAO = await subscriptionRepository.getSubscriptionByGatewaySubscriptionId(
          ctx,
          gatewaySubscriptionId
        );

        if (subscriptionDAO) {
          const { id, userId } = subscriptionDAO;
          await subscriptionService.syncPayPalPayments(ctx, String(userId), id);
        }

        break;
      }
    }
  } else {
    ctx.log.warn('PayPal webhook signature verify failed');
  }

  return {
    body: {},
  };
}
