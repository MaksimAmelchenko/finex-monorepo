import { Unit } from '../model/unit';
import { UnitGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateUnitServiceChanges } from '../types';

export async function updateUnit(
  ctx: IRequestContext,
  projectId: string,
  unitId: string,
  changes: UpdateUnitServiceChanges
): Promise<Unit> {
  return UnitGateway.updateUnit(ctx, projectId, unitId, changes);
}
