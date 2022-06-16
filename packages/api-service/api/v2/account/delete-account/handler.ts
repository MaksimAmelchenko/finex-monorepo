import * as HttpStatus from 'http-status-codes';

import { AccountService } from '../../../../services/account';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ accountId: string }>): Promise<INoContent> {
  const {
    projectId,
    params: { accountId },
  } = ctx;
  await AccountService.deleteAccount(ctx, projectId, accountId);

  return {
    status: HttpStatus.StatusCodes.NO_CONTENT,
  };
}
