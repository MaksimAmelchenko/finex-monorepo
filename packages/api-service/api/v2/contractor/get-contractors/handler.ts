import { ContractorService } from '../../../../services/contractor';
import { IPublicContractor } from '../../../../services/contractor/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<unknown, true>
): Promise<IResponse<{ contractors: IPublicContractor[] }>> {
  const { projectId } = ctx;
  const contractors = await ContractorService.getContractors(ctx, projectId);

  return {
    body: {
      contractors: contractors.map(contractor => contractor.toPublicModel()),
    },
  };
}
