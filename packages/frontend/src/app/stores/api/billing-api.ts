import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CheckSubscriptionStatusResponse,
  CreateSubscriptionResponse,
  GetPlansResponse,
  IBillingApi,
  UpdateSubscriptionChanges,
} from '../../types/billing';

export class BillingApi extends ApiRepository implements IBillingApi {
  static override storeName = 'SubscriptionApi';

  getPlans(): Promise<GetPlansResponse> {
    return this.fetch<GetPlansResponse>({
      method: 'GET',
      url: '/v1/billing/plans',
    });
  }

  createSubscription(gateway: string, planId: string): Promise<CreateSubscriptionResponse> {
    return this.fetch<CreateSubscriptionResponse>({
      method: 'POST',
      url: '/v1/billing/subscriptions',
      body: {
        gateway,
        planId,
      },
    });
  }

  updateSubscription(subscriptionId: string, changes: UpdateSubscriptionChanges): Promise<void> {
    return this.fetch<void>({
      method: 'PATCH',
      url: `/v1/billing/subscriptions/${subscriptionId}`,
      body: changes,
    });
  }

  checkSubscriptionStatus(subscriptionId: string): Promise<CheckSubscriptionStatusResponse> {
    return this.fetch<CheckSubscriptionStatusResponse>({
      method: 'POST',
      url: `/v1/billing/subscriptions/${subscriptionId}/check-status`,
    });
  }

  cancelSubscription(): Promise<void> {
    return this.fetch<void>({
      method: 'POST',
      url: '/v1/billing/subscription/cancel',
    });
  }

  renewSubscription(): Promise<void> {
    return this.fetch<void>({
      method: 'POST',
      url: '/v1/billing/subscription/renew',
    });
  }
}
