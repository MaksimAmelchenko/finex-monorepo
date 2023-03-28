import { CreatePaymentServiceData, IPayment, PaymentService, UpdatePaymentServiceChanges } from './types';
import { IRequestContext } from '../../../types/app';
import { InternalError, NotFoundError } from '../../../libs/errors';
import { paymentMapper } from './payment.mapper';
import { paymentRepository } from './payment.repository';

class PaymentServiceImpl implements PaymentService {
  async createPayment(ctx: IRequestContext, userId: string, data: CreatePaymentServiceData): Promise<IPayment> {
    const paymentDAO = await paymentRepository.createPayment(ctx, userId, data);

    return this.getPayment(ctx, userId, paymentDAO.id);
  }

  async getPayment(ctx: IRequestContext, userId: string, paymentId: string): Promise<IPayment> {
    const paymentDAO = await paymentRepository.getPayment(ctx, userId, paymentId);
    if (!paymentDAO) {
      throw new NotFoundError('Payment not found');
    }

    return paymentMapper.toDomain(paymentDAO);
  }

  async getPaymentByGatewayPaymentId(ctx: IRequestContext, gatewayPaymentId: string): Promise<IPayment> {
    const paymentDAO = await paymentRepository.getPaymentByGatewayPaymentId(ctx, gatewayPaymentId);
    if (!paymentDAO) {
      throw new NotFoundError('Payment not found');
    }

    return paymentMapper.toDomain(paymentDAO);
  }

  async getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPayment> {
    const paymentDAO = await paymentRepository.getInitPayment(ctx, userId, subscriptionId);
    if (!paymentDAO) {
      throw new InternalError('Payment not found');
    }

    return paymentMapper.toDomain(paymentDAO);
  }

  async updatePayment(
    ctx: IRequestContext,
    userId: string,
    paymentId: string,
    changes: UpdatePaymentServiceChanges
  ): Promise<IPayment> {
    await this.getPayment(ctx, userId, paymentId);
    await paymentRepository.updatePayment(ctx, userId, paymentId, changes);
    return this.getPayment(ctx, userId, paymentId);
  }
}

export const paymentService = new PaymentServiceImpl();
