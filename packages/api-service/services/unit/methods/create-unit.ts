import { Unit } from '../model/unit';
import { UnitGateway } from '../gateway';
import { CreateUnitServiceData } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createUnit(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateUnitServiceData
): Promise<Unit> {
  return UnitGateway.createUnit(ctx, projectId, userId, data);
}
