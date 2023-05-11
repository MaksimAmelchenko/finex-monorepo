import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { nordigenService } from '../../../../modules/connection-nordigen/nordigen.service';

interface IRequestParams {
  institutionId: string;
}
export async function handler(ctx: IRequestContext<IRequestParams, true>): Promise<IResponse> {
  const {
    projectId,
    userId,
    params: { institutionId },
    additionalParams: { origin },
  } = ctx;
  const requisition = await nordigenService.createRequisition(ctx, projectId, userId, { institutionId, origin });

  return {
    body: {
      link: requisition.responses[0].link,
    },
  };
}
