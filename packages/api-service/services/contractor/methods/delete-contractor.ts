import { ContractorGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function deleteContractor(ctx: IRequestContext, projectId: string, contractorId: string): Promise<void> {
  return ContractorGateway.deleteContractor(ctx, projectId, contractorId);
}
