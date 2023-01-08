import { BillingService } from './types';
import { IRequestContext } from '../../types/app';
import { parseISO } from 'date-fns';
import { AccessDeniedError } from '../../libs/errors';

class BillingServiceImpl implements BillingService {
  async validateSubscription(ctx: IRequestContext<unknown, true>): Promise<void> {
    if (parseISO(ctx.accessUntil) < new Date()) {
      throw new AccessDeniedError('Your subscription has expired', { code: 'subscriptionHasExpired' });
    }
  }
}

export const billingService = new BillingServiceImpl();
