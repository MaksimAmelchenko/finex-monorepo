import { ContractorService } from '../../../../services/contractor';
import { IPublicContractor, UpdateContractorServiceChanges } from '../../../../services/contractor/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateContractorServiceChanges & { contractorId: string }>
): Promise<IResponse<{ contractor: IPublicContractor }>> {
  const {
    projectId,
    params: { contractorId, ...changes },
  } = ctx;

  const contractor = await ContractorService.updateContractor(ctx, projectId, contractorId, changes);

  return {
    body: {
      contractor: contractor.toPublicModel(),
    },
  };
}
