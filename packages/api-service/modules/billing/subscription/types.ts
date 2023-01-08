import { IRequestContext, TDateTime, TJson } from '../../../types/app';
import { PaymentGateway } from '../payment/types';
import { TUUid } from '../../../../frontend/src/app/types';

// export type SubscriptionStatus = 'pending' | 'active' | 'canceled';
export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  Canceled = 'canceled',
}

export interface ISubscriptionDAO {
  id: TUUid;
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
  id: TUUid;
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
  id: TUUid;
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
    subscriptionId: TUUid
  ): Promise<ISubscriptionDAO | undefined>;

  getSubscriptionById(ctx: IRequestContext, subscriptionId: TUUid): Promise<ISubscriptionDAO | undefined>;

  getSubscriptionByGatewaySubscriptionId(
    ctx: IRequestContext,
    gatewaySubscriptionId: string
  ): Promise<ISubscriptionDAO | undefined>;

  getActiveSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<ISubscriptionDAO | null>;

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

  getSubscription(ctx: IRequestContext<unknown, true>, userId: string, subscriptionId: TUUid): Promise<ISubscription>;

  getActiveSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<ISubscription | null>;

  updateSubscription(
    ctx: IRequestContext,
    userId: string,
    subscriptionId: string,
    changes: UpdateSubscriptionServiceChanges
  ): Promise<ISubscription>;

  cancelSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<void>;
}

export interface SubscriptionMapper {
  toDTO(subscription: ISubscription): ISubscriptionDTO;
  toDomain(subscription: ISubscriptionDAO): ISubscription;
}
