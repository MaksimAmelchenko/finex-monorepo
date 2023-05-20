import { StatusCodes } from 'http-status-codes';

import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { connectionService } from '../../../../modules/connection/connection.service';

interface IParams {
  connectionId: string;
}

export async function handler(ctx: IRequestContext<IParams, true>): Promise<IResponse<INoContent>> {
  const {
    projectId,
    userId,
    params: { connectionId },
  } = ctx;

  await connectionService.deleteConnection(ctx, projectId, userId, connectionId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
