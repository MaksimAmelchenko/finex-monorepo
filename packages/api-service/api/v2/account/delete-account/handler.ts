import * as HttpStatus from 'http-status-codes';

import { AccountService } from '../../../../services/account';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ accountId: string }>): Promise<INoContent> {
  const { accountId } = ctx.params;
  await AccountService.deleteAccount(ctx, accountId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
