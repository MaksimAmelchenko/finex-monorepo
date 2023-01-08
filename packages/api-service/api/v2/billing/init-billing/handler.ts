import { IRequestContext } from '../../../../types/app';
import { paypalService } from '../../../../modules/billing/paypal/paypal.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<any> {
  const paypalPlans = await paypalService.initPlans(ctx.log);
  const payPalWebhook = await paypalService.initWebhook(ctx.log, 'https://app.finex.io/api/v1/billing/paypal-webhook');

  return {
    body: {
      //
      paypalPlans,
      payPalWebhook,
    },
  };
}
