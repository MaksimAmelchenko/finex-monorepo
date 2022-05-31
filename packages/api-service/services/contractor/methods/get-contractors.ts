import { Contractor } from '../model/contractor';
import { ContractorGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getContractors(ctx: IRequestContext, projectId: string): Promise<Contractor[]> {
  return ContractorGateway.getContractors(ctx, projectId);
}
