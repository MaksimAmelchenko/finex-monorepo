import { getRestApi } from '../../../libs/rest-api';

import { cancelSubscription } from './cancel-subscription';
import { checkSubscriptionStatus } from './check-subscription-status';
import { createSubscription } from './create-subscription';
import { getPlansRouteOptions } from './get-plans';
import { initBilling } from './init-billing';
import { payPalWebhook } from './paypal-webhook';
import { renewSubscription } from './renew-subscription';
import { renewSubscriptions } from './renew-subscriptions';
import { updateSubscription } from './update-subsription';
import { yookassaWebhook } from './yookassa-webhook';

export const billingApi = getRestApi([
  //
  cancelSubscription,
  checkSubscriptionStatus,
  createSubscription,
  getPlansRouteOptions,
  // initBilling,
  payPalWebhook,
  renewSubscription,
  renewSubscriptions,
  updateSubscription,
  yookassaWebhook,
]);
