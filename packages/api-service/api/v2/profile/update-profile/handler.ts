import { IProfile, UpdateUserServiceChanges } from '../../../../modules/user/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { userMapper } from '../../../../modules/user/user.mapper';
import { userService } from '../../../../modules/user/user.service';

export async function handler(
  ctx: IRequestContext<UpdateUserServiceChanges, true>
): Promise<IResponse<{ profile: IProfile }>> {
  const { userId, params } = ctx;
  const user = await userService.updateUser(ctx, userId, params);
  return {
    body: {
      profile: userMapper.toProfile(user),
    },
  };
}
