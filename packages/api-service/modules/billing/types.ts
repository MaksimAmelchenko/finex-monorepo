import { IRequestContext } from '../../types/app';

export interface BillingService {
  validateSubscription(ctx: IRequestContext<unknown, true>): Promise<void>;
}
