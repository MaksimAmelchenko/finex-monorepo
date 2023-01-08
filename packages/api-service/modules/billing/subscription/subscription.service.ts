import * as moment from 'moment';
import { max, parseISO } from 'date-fns';

import {
  ICreateSubscriptionResponse,
  ISubscription,
  SubscriptionService,
  SubscriptionStatus,
  UpdateSubscriptionServiceChanges,
} from './types';
import { IRequestContext } from '../../../types/app';
import { InternalError, InvalidParametersError, NotFoundError } from '../../../libs/errors';
import { PaymentGateway } from '../payment/types';
import { TUUid } from '../../../../frontend/src/app/types';
import { paypalService } from '../paypal/paypal.service';
import { paymentRepository } from '../payment/payment.repository';
import { paymentService } from '../payment/payment.service';
import { yookassaService } from '../yookassa/yookassa.service';
import { planService } from '../plan/plan.service';
import { subscriptionMapper } from './subscription.mapper';
import { subscriptionRepository } from './subscription.repository';
import { t } from '../../../libs/t';
import { userService } from '../../user/user.service';

class SubscriptionServiceImpl implements SubscriptionService {
  async createSubscription(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    gateway: PaymentGateway,
    planId: string
  ): Promise<ICreateSubscriptionResponse> {
    const { locale } = ctx.params;
    const user = await userService.getUser(ctx, userId);
    const { price: amount, currency, productName, duration } = await planService.getPlan(ctx, planId);

    const startAt: Date = max([parseISO(user.accessUntil), new Date()]);
    const endAt: Date = moment.utc(startAt).add(moment.duration(duration)).toDate();

    if (!amount || !currency) {
      throw new InvalidParametersError('Plan has no price');
    }

    switch (gateway) {
      case 'yookassa': {
        const yookassaPayment = await yookassaService.createPayment(ctx, userId, {
          amount,
          currency,
          description: t<string>(productName, locale),
        });

        if (!yookassaPayment.confirmation.confirmation_token) {
          throw new InternalError(`Confirmation token not found`);
        }

        const subscriptionDAO = await subscriptionRepository.createSubscription(ctx, userId, {
          planId,
          status: SubscriptionStatus.Pending,
          gateway,
        });

        await paymentService.createPayment(ctx, userId, {
          status: yookassaPayment.status,
          initiator: 'user',
          subscriptionId: subscriptionDAO.id,
          planId,
          amount,
          currency,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          gateway,
          gatewayPaymentId: yookassaPayment.id,
          gatewayResponses: [yookassaPayment],
        });

        return {
          subscriptionId: subscriptionDAO.id,
          paymentConfirmationToken: yookassaPayment.confirmation.confirmation_token,
        };
      }
      case 'paypal': {
        const subscriptionDAO = await subscriptionRepository.createSubscription(ctx, userId, {
          planId,
          status: SubscriptionStatus.Pending,
          gateway,
        });

        return {
          subscriptionId: subscriptionDAO.id,
        };
      }
    }

    throw new InternalError(`Payment gateway ${gateway} is not implemented`);
  }

  async getSubscription(ctx: IRequestContext, userId: string, subscriptionId: TUUid): Promise<ISubscription> {
    const subscriptionDAO = await subscriptionRepository.getSubscription(ctx, userId, subscriptionId);
    if (!subscriptionDAO) {
      throw new NotFoundError('Subscription not found');
    }

    return subscriptionMapper.toDomain(subscriptionDAO);
  }

  async getActiveSubscription(ctx: IRequestContext<unknown, true>, userId: string): Promise<ISubscription | null> {
    const subscription = await subscriptionRepository.getActiveSubscription(ctx, userId);
    if (!subscription) {
      return null;
    }
    return subscriptionMapper.toDomain(subscription);
  }

  async updateSubscription(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    subscriptionId: string,
    changes: UpdateSubscriptionServiceChanges
  ): Promise<ISubscription> {
    await this.getSubscription(ctx, userId, subscriptionId);
    await subscriptionRepository.updateSubscription(ctx, userId, subscriptionId, changes);

    return this.getSubscription(ctx, userId, subscriptionId);
  }

  async cancelSubscription(ctx: IRequestContext, userId: string): Promise<void> {
    const subscriptionDAO = await subscriptionRepository.getActiveSubscription(ctx, userId);
    if (subscriptionDAO) {
      if (subscriptionDAO.gateway === 'paypal') {
        const gatewaySubscriptionId = subscriptionDAO.gatewaySubscriptionId!;

        const paypalSubscription = await paypalService.getSubscription(ctx.log, gatewaySubscriptionId);
        if (paypalSubscription.status === 'ACTIVE') {
          await paypalService.cancelSubscription(ctx.log, gatewaySubscriptionId);
        }
      }

      await subscriptionRepository.updateSubscription(ctx, userId, subscriptionDAO.id, {
        status: SubscriptionStatus.Canceled,
      });
    }
  }

  async syncPayPalPayments(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.getSubscription(ctx, userId, subscriptionId);
    const plan = await planService.getPlan(ctx, subscription.planId);
    if (subscription.gateway !== 'paypal') {
      throw new InvalidParametersError('Not PayPal subscription');
    }
    const gatewaySubscriptionId = subscription.gatewaySubscriptionId!;

    const transactions = await paypalService.getSubscriptionTransactions(ctx.log, gatewaySubscriptionId);
    for (const transaction of transactions) {
      const paymentDAO = await paymentRepository.getPaymentByGatewayPaymentId(ctx, transaction.id);
      if (!paymentDAO) {
        // the problem is we losing the current access period,
        // the subscription starts from the subscription moment instead of from the end of the current access period
        const startAt: Date = parseISO(transaction.time);
        const endAt: Date = moment.utc(startAt).add(moment.duration(plan.duration)).toDate();

        await paymentService.createPayment(ctx, userId, {
          status: transaction.status === 'COMPLETED' ? 'succeeded' : 'canceled',
          initiator: 'subscription',
          subscriptionId: subscription.id,
          planId: subscription.planId,
          amount: Number(transaction.amount_with_breakdown.gross_amount.value),
          currency: transaction.amount_with_breakdown.gross_amount.currency_code,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          gateway: 'paypal',
          gatewayPaymentId: transaction.id,
          gatewayResponses: [transaction],
        });
      }
    }
  }
}

export const subscriptionService = new SubscriptionServiceImpl();
