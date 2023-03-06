import { ContractorService } from '../../../../services/contractor';
import { IPublicContractor, UpdateContractorServiceChanges } from '../../../../services/contractor/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateContractorServiceChanges & { contractorId: string }, true>
): Promise<IResponse<{ contractor: IPublicContractor }>> {
  const {
    projectId,
    params: { contractorId, name, note },
  } = ctx;

  const contractor = await ContractorService.updateContractor(ctx, projectId, contractorId, { name, note });

  return {
    body: {
      contractor: contractor.toPublicModel(),
    },
  };
}
