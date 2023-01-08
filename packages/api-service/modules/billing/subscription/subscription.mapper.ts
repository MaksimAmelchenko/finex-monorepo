import { ISubscription, ISubscriptionDAO, ISubscriptionDTO, SubscriptionMapper } from './types';
import { Subscription } from './models/subscription';

class SubscriptionMapperImpl implements SubscriptionMapper {
  toDomain({
    id,
    userId,
    status,
    planId,
    gateway,
    gatewaySubscriptionId,
    gatewayMetadata,
    createdAt,
    updatedAt,
  }: ISubscriptionDAO): ISubscription {
    return new Subscription({
      id,
      userId: String(userId),
      status,
      planId,
      gateway,
      gatewaySubscriptionId,
      gatewayMetadata,
      createdAt,
      updatedAt,
    });
  }

  toDTO({ id, planId }: ISubscription): ISubscriptionDTO {
    return {
      id,
      planId,
    };
  }
}

export const subscriptionMapper = new SubscriptionMapperImpl();
