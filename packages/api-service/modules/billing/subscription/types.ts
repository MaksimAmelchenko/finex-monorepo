import { IRequestContext, TDateTime, TJson } from '../../../types/app';
import { PaymentGateway } from '../payment/types';

// export type SubscriptionStatus = 'pending' | 'active' | 'canceled';
export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  Canceled = 'canceled',
}

export interface ISubscriptionDAO {
  id: string;
  userId: number;
  status: SubscriptionStatus;
  planId: string;
  gateway: PaymentGateway | null;
  gatewaySubscriptionId: string | null;
  gatewayMetadata: TJson | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface ISubscriptionEntity {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  planId: string;
  gateway: PaymentGateway | null;
  gatewaySubscriptionId: string | null;
  gatewayMetadata: TJson | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface ISubscription extends ISubscriptionEntity {}

export type ISubscriptionDTO = {
  id: string;
  planId: string;
};

export interface CreateSubscriptionRepositoryData {
  planId: string;
  status: SubscriptionStatus;
  gateway?: PaymentGateway;
  gatewaySubscriptionId?: string;
  gatewayMetadata?: TJson;
}

export type CreateSubscriptionServiceData = CreateSubscriptionRepositoryData;

export interface UpdateSubscriptionRepositoryChanges {
  status?: SubscriptionStatus;
  gatewaySubscriptionId?: string;
  gatewayMetadata?: TJson;
}

export type UpdateSubscriptionServiceChanges = UpdateSubscriptionRepositoryChanges;

export type ICreateSubscriptionResponse =
  | {
      subscriptionId: string;
      paymentConfirmationToken: string;
    }
  | {
      subscriptionId: string;
    };

export interface SubscriptionRepository {
  createSubscription(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: CreateSubscriptionRepositoryData
  ): Promise<ISubscriptionDAO>;

  getSubscription(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    subscriptionId: string
  ): Promise<ISubscriptionDAO | undefined>;

  getSubscriptionById(ctx: IRequestContext, subscriptionId: string): Promise<ISubscriptionDAO | undefined>;

  getSubscriptionByGatewaySubscriptionId(
    ctx: IRequestContext,
    gatewaySubscriptionId: string
  ): Promise<ISubscriptionDAO | undefined>;

  getActiveSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<ISubscriptionDAO | null>;

  getExpiringSubscriptions(ctx: IRequestContext): Promise<ISubscriptionDAO[]>;

  updateSubscription(
    ctx: IRequestContext,
    userId: string,
    subscriptionId: string,
    changes: UpdateSubscriptionRepositoryChanges
  ): Promise<ISubscriptionDAO>;
}

export interface SubscriptionService {
  createSubscription(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    paymentGateway: PaymentGateway,
    planId: string
  ): Promise<ICreateSubscriptionResponse>;

  getSubscription(ctx: IRequestContext<unknown, true>, userId: string, subscriptionId: string): Promise<ISubscription>;

  getActiveSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<ISubscription | null>;

  updateSubscription(
    ctx: IRequestContext,
    userId: string,
    subscriptionId: string,
    changes: UpdateSubscriptionServiceChanges
  ): Promise<ISubscription>;

  cancelSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<void>;

  renewSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<void>;

  renewSubscriptions(ctx: IRequestContext): Promise<void>;
}

export interface SubscriptionMapper {
  toDTO(subscription: ISubscription): ISubscriptionDTO;
  toDomain(subscription: ISubscriptionDAO): ISubscription;
}
