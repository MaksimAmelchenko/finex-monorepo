import { IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { nordigenService } from '../../../../modules/connection-nordigen/nordigen.service';

interface IRequestParams {
  requisitionId: string;
}

export async function handler(
  ctx: IRequestContext<IRequestParams, true>
): Promise<IResponse<{ connectionId: string }>> {
  const {
    projectId,
    userId,
    params: { requisitionId },
  } = ctx;

  const connection = await nordigenService.completeRequisition(ctx, projectId, userId, requisitionId);

  return {
    body: {
      connectionId: connection.id,
    },
  };
}
