import { StatusCodes } from 'http-status-codes';

import config from '../../../../libs/config';
import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { UnauthorizedError } from '../../../../libs/errors';
import { connectionService } from '../../../../modules/connection/connection.service';

const secret = config.get('connections:secret');

export async function handler(ctx: IRequestContext<any>): Promise<IResponse<INoContent>> {
  if (ctx.params.secret !== secret) {
    throw new UnauthorizedError('Invalid secret');
  }

  await connectionService.syncAllAccounts(ctx);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
