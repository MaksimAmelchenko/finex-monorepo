import { Unit } from '../model/unit';
import { UnitGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getUnits(ctx: IRequestContext, projectId: string): Promise<Unit[]> {
  return UnitGateway.getUnits(ctx, projectId);
}
