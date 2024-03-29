import { IProfile } from '../../../../modules/user/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';
import { userMapper } from '../../../../modules/user/user.mapper';
import { userService } from '../../../../modules/user/user.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ profile: IProfile }>> {
  const { userId } = ctx;
  const user = await userService.getUser(ctx, userId);
  const subscription = await subscriptionService.getActiveSubscription(ctx, userId);

  return {
    body: {
      profile: userMapper.toProfile(user, subscription),
    },
  };
}
