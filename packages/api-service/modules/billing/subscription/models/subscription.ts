import { ISubscription, ISubscriptionEntity, SubscriptionStatus } from '../types';
import { PaymentGateway } from '../../payment/types';
import { TDateTime, TJson } from '../../../../types/app';
import { TUUid } from '../../../../../frontend/src/app/types';

export class Subscription implements ISubscription {
  readonly id: TUUid;
  readonly userId: string;
  status: SubscriptionStatus;
  planId: string;
  gateway: PaymentGateway | null;
  gatewaySubscriptionId: string | null;
  gatewayMetadata: TJson | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor({
    id,
    userId,
    planId,
    status,
    gateway,
    gatewaySubscriptionId,
    gatewayMetadata,
    createdAt,
    updatedAt,
  }: ISubscriptionEntity) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.planId = planId;
    this.gateway = gateway;
    this.gatewaySubscriptionId = gatewaySubscriptionId;
    this.gatewayMetadata = gatewayMetadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
