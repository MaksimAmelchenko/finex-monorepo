import { Payment } from './models/payment';
import { IPayment, IPaymentDAO, PaymentMapper } from './types';

class PaymentMapperImpl implements PaymentMapper {
  toDomain({
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
  }: IPaymentDAO): IPayment {
    return new Payment({
      id,
      userId: String(userId),
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
    });
  }
}

export const paymentMapper = new PaymentMapperImpl();
