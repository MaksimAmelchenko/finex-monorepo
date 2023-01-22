import * as uuid from 'uuid';

import {
  CreateSubscriptionRepositoryData,
  ISubscriptionDAO,
  SubscriptionRepository,
  SubscriptionStatus,
  UpdateSubscriptionRepositoryChanges,
} from './types';
import { IRequestContext } from '../../../types/app';
import { SubscriptionDAO } from './models/subscription-dao';

class SubscriptionRepositoryImpl implements SubscriptionRepository {
  async createSubscription(
    ctx: IRequestContext,
    userId: string,
    data: CreateSubscriptionRepositoryData
  ): Promise<ISubscriptionDAO> {
    ctx.log.trace({ data }, 'try to create subscription');

    const { planId, status, gateway, gatewaySubscriptionId, gatewayMetadata } = data;

    const id = uuid.v4();
    const subscriptionDAO = await SubscriptionDAO.query(ctx.trx).insert({
      id,
      userId: Number(userId),
      status,
      planId,
      gateway,
      gatewaySubscriptionId,
      gatewayMetadata,
    });

    ctx.log.info({ subscriptionId: subscriptionDAO.id }, 'created subscription');

    return (await this.getSubscription(ctx, userId, subscriptionDAO.id)) as ISubscriptionDAO;
  }

  async getSubscription(
    ctx: IRequestContext,
    userId: string,
    subscriptionId: string
  ): Promise<ISubscriptionDAO | undefined> {
    ctx.log.trace({ subscriptionId }, 'try to get subscription');

    return SubscriptionDAO.query(ctx.trx)
      .findById(subscriptionId)
      .where({ userId: Number(userId) });
  }

  async getSubscriptionById(ctx: IRequestContext, subscriptionId: string): Promise<ISubscriptionDAO | undefined> {
    ctx.log.trace({ subscriptionId }, 'try to get subscription');

    return SubscriptionDAO.query(ctx.trx).findById(subscriptionId);
  }

  async getSubscriptionByGatewaySubscriptionId(
    ctx: IRequestContext,
    gatewaySubscriptionId: string
  ): Promise<ISubscriptionDAO | undefined> {
    ctx.log.trace({ gatewaySubscriptionId }, 'try to get subscription by gateway subscription id');

    return SubscriptionDAO.query(ctx.trx).findOne({ gatewaySubscriptionId });
  }

  async getActiveSubscription(ctx: IRequestContext, userId: string): Promise<ISubscriptionDAO | null> {
    ctx.log.trace({ userId }, 'try to get active subscription');
    const subscription = await SubscriptionDAO.query(ctx.trx).findOne({
      userId: Number(userId),
      status: SubscriptionStatus.Active,
    });

    return subscription ?? null;
  }

  async updateSubscription(
    ctx: IRequestContext,
    userId: string,
    subscriptionId: string,
    changes: UpdateSubscriptionRepositoryChanges
  ): Promise<ISubscriptionDAO> {
    ctx.log.trace({ subscriptionId, changes }, 'try to update subscription');

    const { status, gatewaySubscriptionId, gatewayMetadata } = changes;

    await SubscriptionDAO.query(ctx.trx)
      .patch({
        status,
        gatewaySubscriptionId,
        gatewayMetadata,
      })
      .where({
        userId: Number(userId),
        id: subscriptionId,
      });

    ctx.log.info({ subscriptionId }, 'updated subscription');

    return (await this.getSubscription(ctx, userId, subscriptionId)) as ISubscriptionDAO;
  }
}

export const subscriptionRepository = new SubscriptionRepositoryImpl();
