import { Contractor } from '../../model/contractor';
import { IRequestContext } from '../../../../types/app';
import { UpdateContractorGatewayChanges } from '../../types';

export async function updateContractor(
  ctx: IRequestContext,
  projectId: string,
  contractorId: string,
  changes: UpdateContractorGatewayChanges
): Promise<Contractor> {
  ctx.log.trace({ projectId, contractorId, changes }, 'try to update contractor');

  const contractor = await Contractor.query(ctx.trx).patchAndFetchById(
    [Number(projectId), Number(contractorId)],
    changes
  );

  ctx.log.info({ contractorId }, 'updated contractor');
  return contractor;
}
