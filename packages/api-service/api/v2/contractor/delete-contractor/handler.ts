import { StatusCodes } from 'http-status-codes';

import { ContractorService } from '../../../../services/contractor';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ contractorId: string }>): Promise<INoContent> {
  const {
    projectId,
    params: { contractorId },
  } = ctx;
  await ContractorService.deleteContractor(ctx, projectId, contractorId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
