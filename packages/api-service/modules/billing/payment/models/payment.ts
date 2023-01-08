import { Payment as YookassaPayment } from '@a2seven/yoo-checkout/build/models';

import { Initiator, IPayment, IPaymentEntity, PaymentGateway, PaymentStatus } from '../types';
import { TDateTime } from '../../../../types/app';

export class Payment implements IPayment {
  id: string;
  userId: string;
  status: PaymentStatus;

  initiator: Initiator;
  subscriptionId: string | null;
  planId: string;
  amount: number;
  currency: string;
  startAt: TDateTime;
  endAt: TDateTime;

  gateway: PaymentGateway;
  gatewayPaymentId: string | null;
  gatewayResponses: YookassaPayment[];

  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor({
    id,
    userId,
    status,
    initiator,
    subscriptionId,
    planId,
    amount,
    currency,
    startAt,
    endAt,
    gateway,
    gatewayPaymentId,
    gatewayResponses,
    createdAt,
    updatedAt,
  }: IPaymentEntity) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.initiator = initiator;
    this.subscriptionId = subscriptionId;
    this.planId = planId;
    this.amount = amount;
    this.currency = currency;
    this.startAt = startAt;
    this.endAt = endAt;
    this.gateway = gateway;
    this.gatewayPaymentId = gatewayPaymentId;
    this.gatewayResponses = gatewayResponses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
