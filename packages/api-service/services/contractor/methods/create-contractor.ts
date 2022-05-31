import { Contractor } from '../model/contractor';
import { ContractorGateway } from '../gateway';
import { CreateContractorServiceData } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createContractor(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateContractorServiceData
): Promise<Contractor> {
  return ContractorGateway.createContractor(ctx, projectId, userId, data);
}
