import { Deferred } from '../lib/deferred';
import {
  CreateSubscriptionResponse,
  IBillingApi,
  PaymentGateway,
  Plan,
  SubscriptionStatus,
  UpdateSubscriptionChanges,
} from '../types/billing';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';

export class BillingRepository extends ManageableStore {
  static storeName = 'BillingRepository';
  private isPolling = false;

  constructor(mainStore: MainStore, private api: IBillingApi) {
    super(mainStore);
  }

  async getPlans(): Promise<Plan[]> {
    const { plans } = await this.api.getPlans();
    return plans;
  }

  async createSubscription<T = CreateSubscriptionResponse>(
    gateway: PaymentGateway,
    planId: string
  ): Promise<T> {
    return this.api.createSubscription(gateway, planId) as T;
  }

  async updateSubscription(subscriptionId: string, changes: UpdateSubscriptionChanges): Promise<void> {
    return this.api.updateSubscription(subscriptionId, changes);
  }

  async subscriptionStatusPolling(subscriptionId: string): Promise<void> {
    const deferred = new Deferred<void>();
    this.isPolling = true;

    const polling = () => {
      if (!this.isPolling) {
        deferred.reject(new Error('Stopped'));
        return;
      }

      this.api
        .checkSubscriptionStatus(subscriptionId)
        .then(({ status }) => {
          if (status === SubscriptionStatus.Active) {
            deferred.resolve();
            return;
          }
          setTimeout(polling, 1000);
        })
        .catch(error => deferred.reject(error as any));
    };

    polling();

    return deferred.promise;
  }

  stopPolling() {
    this.isPolling = false;
  }

  async cancelSubscription(): Promise<void> {
    return this.api.cancelSubscription();
  }

  clear(): void {}
}
