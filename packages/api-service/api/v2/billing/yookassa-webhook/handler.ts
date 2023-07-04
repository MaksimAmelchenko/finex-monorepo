import { Payment as YookassaPayment } from '@a2seven/yoo-checkout/build/models';

import { IRequestContext } from '../../../../types/app';
import { paymentService } from '../../../../modules/billing/payment/payment.service';

// https://yookassa.ru/developers/using-api/webhooks
export async function handler(
  ctx: IRequestContext<{ type: 'notification'; event: string; object: YookassaPayment }>
): Promise<any> {
  const { type, event, object } = ctx.params;
  const { ip } = ctx.additionalParams;
  ctx.log.trace({ additionalParams: ctx.additionalParams });

  // 185.71.76.0/27
  // 185.71.77.0/27
  // 77.75.153.0/25
  // 77.75.156.11
  // 77.75.156.35
  // 77.75.154.128/25
  // 2a02:5180::/32

  // if (![].includes(ip)) {
  //   throw new AccessDeniedError();
  // }

  ctx.log.trace({ type, event, object }, 'yookassa webhook');
  const userId = object.metadata.userId;

  if (event === 'payment.succeeded' || event === 'payment.canceled') {
    const payment = await paymentService.getPaymentByGatewayPaymentId(ctx, object.id);

    if (!['succeeded', 'canceled'].includes(payment.status)) {
      const status = event === 'payment.succeeded' ? 'succeeded' : 'canceled';

      await paymentService.updatePayment(ctx, userId, payment.id, {
        status,
        gatewayResponse: object,
      });
    }
  }

  return {
    body: {},
  };
}
