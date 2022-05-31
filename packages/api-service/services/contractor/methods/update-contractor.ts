import { Contractor } from '../model/contractor';
import { ContractorGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateContractorServiceChanges } from '../types';

export async function updateContractor(
  ctx: IRequestContext,
  projectId: string,
  contractorId: string,
  changes: UpdateContractorServiceChanges
): Promise<Contractor> {
  return ContractorGateway.updateContractor(ctx, projectId, contractorId, changes);
}
