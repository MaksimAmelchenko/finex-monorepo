import { UnitGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function deleteUnit(ctx: IRequestContext, projectId: string, unitId: string): Promise<void> {
  return UnitGateway.deleteUnit(ctx, projectId, unitId);
}
