import { ContractorService } from '../../../../services/contractor';
import { CreateContractorServiceData, IPublicContractor } from '../../../../services/contractor/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateContractorServiceData, true>
): Promise<IResponse<{ contractor: IPublicContractor }>> {
  const {
    params: { name, note },
    projectId,
    userId,
  } = ctx;
  const contractor = await ContractorService.createContractor(ctx, projectId, userId, { name, note });

  return {
    body: {
      contractor: contractor.toPublicModel(),
    },
  };
}
