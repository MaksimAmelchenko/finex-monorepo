import * as moment from 'moment';
import { differenceInDays, max, parseISO } from 'date-fns';

import {
  ICreateSubscriptionResponse,
  ISubscription,
  SubscriptionService,
  SubscriptionStatus,
  UpdateSubscriptionServiceChanges,
} from './types';
import { IRequestContext, Locale } from '../../../types/app';
import { InternalError, InvalidParametersError, NotFoundError } from '../../../libs/errors';
import { PaymentGateway } from '../payment/types';
import { captureException } from '../../../libs/sentry';
import { knex } from '../../../knex';
import { paymentRepository } from '../payment/payment.repository';
import { paymentService } from '../payment/payment.service';
import { paypalService } from '../paypal/paypal.service';
import { planService } from '../plan/plan.service';
import { subscriptionMapper } from './subscription.mapper';
import { subscriptionRepository } from './subscription.repository';
import { t } from '../../../libs/t';
import { userService } from '../../user/user.service';
import { yookassaService } from '../yookassa/yookassa.service';

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
          description: t(productName, locale),
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

  async getSubscription(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<ISubscription> {
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

  async getExpiringSubscriptions(ctx: IRequestContext): Promise<ISubscription[]> {
    const subscriptions = await subscriptionRepository.getExpiringSubscriptions(ctx);
    return subscriptions.map(subscriptionMapper.toDomain);
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
    ctx.log.trace({ transactions });

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

  async renewSubscription(ctx: IRequestContext, userId: string): Promise<void> {
    const subscription = await subscriptionRepository.getActiveSubscription(ctx, userId);
    if (!subscription) {
      throw new NotFoundError('Active subscription not found');
    }

    const user = await userService.getUser(ctx, userId);

    // check if subscription is expired
    // if the access does not expire in a day or has not already expired
    if (differenceInDays(parseISO(user.accessUntil), new Date()) > 0) {
      throw new InvalidParametersError('Subscription is not expired');
    }

    // check subscription is not canceled
    if (subscription.status !== SubscriptionStatus.Active) {
      throw new InvalidParametersError('Subscription is not active');
    }

    const { locale } = ctx.params;
    const {
      price: amount,
      currency,
      productName,
      duration,
      isRenewable,
    } = await planService.getPlan(ctx, subscription.planId);

    if (!isRenewable) {
      throw new InvalidParametersError('Plan is not renewable');
    }

    const startAt: Date = max([parseISO(user.accessUntil), new Date()]);
    const endAt: Date = moment.utc(startAt).add(moment.duration(duration)).toDate();

    if (!amount || !currency) {
      throw new InvalidParametersError('Plan has no price');
    }

    switch (subscription.gateway) {
      case 'yookassa': {
        const yookassaPayment = await yookassaService.createPayment(ctx, userId, {
          amount,
          currency,
          description: t(productName, locale),
          paymentMethodId: subscription.gatewayMetadata.paymentMethodId,
        });

        await paymentService.createPayment(ctx, userId, {
          status: yookassaPayment.status,
          initiator: 'subscription',
          subscriptionId: subscription.id,
          planId: subscription.planId,
          amount,
          currency,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          gateway: subscription.gateway,
          gatewayPaymentId: yookassaPayment.id,
          gatewayResponses: [yookassaPayment],
        });

        break;
      }
      default: {
        throw new InvalidParametersError(`Gateway ${subscription.gateway} is not implemented`);
      }
    }
  }

  async renewSubscriptions(ctx: IRequestContext): Promise<void> {
    const subscriptions = await this.getExpiringSubscriptions(ctx);
    for (const subscription of subscriptions) {
      ctx.log.trace({ subscription });
      const trx = await knex.transaction();
      const isolateCtx = {
        ...ctx,
        trx,
        params: {
          ...ctx.params,
          locale: Locale.Ru,
        },
      };

      try {
        await this.renewSubscription(isolateCtx, subscription.userId);
        isolateCtx.trx.commit();
      } catch (err) {
        isolateCtx.trx.rollback();
        ctx.log.error(err);
        captureException(err);
      }
    }
  }
}

export const subscriptionService = new SubscriptionServiceImpl();
