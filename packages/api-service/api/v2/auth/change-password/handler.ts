import { StatusCodes } from 'http-status-codes';

import { ChangePasswordServiceParams } from '../../../../modules/user/types';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { userService } from '../../../../modules/user/user.service';

export async function handler(ctx: IRequestContext<ChangePasswordServiceParams, true>): Promise<INoContent> {
  const { userId, params } = ctx;
  await userService.changePassword(ctx, userId, params);
  return {
    status: StatusCodes.NO_CONTENT,
  };
}
