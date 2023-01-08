export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  Canceled = 'canceled',
}

export type PaymentGateway = 'yookassa' | 'paypal';

export type CreateSubscriptionResponse = CreateYookassaSubscriptionResponse | CreatePaypalSubscriptionResponse;

export type CreateYookassaSubscriptionResponse = {
  subscriptionId: string;
  paymentConfirmationToken: string;
};

export type CreatePaypalSubscriptionResponse = {
  subscriptionId: string;
};

export interface CheckSubscriptionStatusResponse {
  status: SubscriptionStatus;
}

export interface GetPlansResponse {
  plans: PlanDTO[];
}

export interface PlanDTO {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
  description: string;
  duration: string;
  isEnabled: boolean;
  isRenewable: boolean;
  availablePaymentGateways: PaymentGateway[];
  paypalPlanId: string | null;
}

export interface Plan extends PlanDTO {}

// export type PaymentStatus = 'waiting_for_capture' | 'pending' | 'succeeded' | 'canceled';

export type UpdateSubscriptionChanges = {
  gatewaySubscriptionId: string;
};

export interface IBillingApi {
  getPlans(): Promise<GetPlansResponse>;
  createSubscription(gateway: string, planId: string): Promise<CreateSubscriptionResponse>;
  updateSubscription(subscriptionId: string, changes: UpdateSubscriptionChanges): Promise<void>;
  checkSubscriptionStatus(subscriptionId: string): Promise<CheckSubscriptionStatusResponse>;
  cancelSubscription(): Promise<void>;
}
