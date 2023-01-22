import * as uuid from 'uuid';

import { CreatePaymentRepositoryData, IPaymentDAO, PaymentRepository, UpdatePaymentRepositoryChanges } from './types';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';
import { PaymentDAO } from './models/payment-dao';
import { knex } from '../../../knex';

class PaymentRepositoryImpl implements PaymentRepository {
  async createPayment(ctx: IRequestContext, userId: string, data: CreatePaymentRepositoryData): Promise<IPaymentDAO> {
    ctx.log.trace({ data }, 'try to create payment');

    const {
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
    } = data;

    const id = uuid.v4();
    const paymentDAO = await PaymentDAO.query(ctx.trx).insert({
      id,
      userId: Number(userId),
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
    });

    ctx.log.info({ paymentId: paymentDAO.id }, 'created payment');

    return (await this.getPayment(ctx, userId, paymentDAO.id)) as IPaymentDAO;
  }

  async getPayment(ctx: IRequestContext, userId: string, paymentId: string): Promise<IPaymentDAO | undefined> {
    ctx.log.trace({ paymentId }, 'try to get payment');

    return PaymentDAO.query(ctx.trx)
      .findById(paymentId)
      .where({ userId: Number(userId) });
  }

  async getPaymentByGatewayPaymentId(ctx: IRequestContext, gatewayPaymentId: string): Promise<IPaymentDAO | undefined> {
    ctx.log.trace({ gatewayPaymentId }, 'try to get payment by gateway payment id');

    return PaymentDAO.query(ctx.trx).findOne({ gatewayPaymentId });
  }

  async getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPaymentDAO | undefined> {
    ctx.log.trace({ subscriptionId }, 'try to get an init payment');

    return PaymentDAO.query(ctx.trx).findOne({ userId: Number(userId), subscriptionId, initiator: 'user' });
  }

  async updatePayment(
    ctx: IRequestContext,
    userId: string,
    paymentId: string,
    changes: UpdatePaymentRepositoryChanges
  ): Promise<IPaymentDAO> {
    ctx.log.trace({ paymentId, changes }, 'try to update payment');

    // instance is used due to the insert/update PaymentDAO model triggers are used to create access period record
    const payment = await PaymentDAO.query(ctx.trx).findOne({
      userId: Number(userId),
      id: paymentId,
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    const { subscriptionId, status, gatewayResponse } = changes;

    await payment.$query(ctx.trx).patch({
      subscriptionId,
      status,
      gatewayResponses: gatewayResponse ? knex.raw('array_append(gateway_responses, ?)', [gatewayResponse]) : undefined,
    });

    ctx.log.info({ paymentId }, 'updated payment');

    return (await this.getPayment(ctx, userId, paymentId)) as IPaymentDAO;
  }
}

export const paymentRepository = new PaymentRepositoryImpl();
