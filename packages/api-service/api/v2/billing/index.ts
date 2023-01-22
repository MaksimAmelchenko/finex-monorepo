import { getRestApi } from '../../../libs/rest-api';

import { cancelSubscription } from './cancel-subscription';
import { checkSubscriptionStatus } from './check-subscription-status';
import { createSubscription } from './create-subscription';
import { getPlansRouteOptions } from './get-plans';
import { payPalWebhook } from './paypal-webhook';
import { updateSubscription } from './update-subsription';
import { yookassaWebhook } from './yookassa-webhook';
import { initBilling } from './init-billing';

export const billingApi = getRestApi([
  //
  cancelSubscription,
  checkSubscriptionStatus,
  createSubscription,
  getPlansRouteOptions,
  // initBilling,
  payPalWebhook,
  updateSubscription,
  yookassaWebhook,
]);
