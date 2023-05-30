import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { nordigenService } from '../../../../modules/connection-nordigen/nordigen.service';

interface IRequestParams {
  institutionId: string;
  isRetrieveMaxPeriodTransactions?: boolean;
}
export async function handler(ctx: IRequestContext<IRequestParams, true>): Promise<IResponse> {
  const {
    projectId,
    userId,
    params: { institutionId, isRetrieveMaxPeriodTransactions = false },
    additionalParams: { origin },
  } = ctx;
  const requisition = await nordigenService.createRequisition(ctx, projectId, userId, {
    institutionId,
    origin,
    isRetrieveMaxPeriodTransactions,
  });

  return {
    body: {
      link: requisition.responses[0].link,
    },
  };
}
