import { StatusCodes } from 'http-status-codes';

import { DeleteUserServiceParams } from '../../../../modules/user/types';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { userService } from '../../../../modules/user/user.service';

export async function handler(ctx: IRequestContext<DeleteUserServiceParams, true>): Promise<INoContent> {
  const { userId, params } = ctx;
  await userService.deleteUser(ctx, userId, params);
  return {
    status: StatusCodes.NO_CONTENT,
  };
}
