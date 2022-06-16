import { Unit } from '../../model/unit';
import { IRequestContext } from '../../../../types/app';
import { UpdateUnitGatewayChanges } from '../../types';

export async function updateUnit(
  ctx: IRequestContext,
  projectId: string,
  unitId: string,
  changes: UpdateUnitGatewayChanges
): Promise<Unit> {
  ctx.log.trace({ projectId, unitId, changes }, 'try to update unit');

  const unit = await Unit.query(ctx.trx).patchAndFetchById([Number(projectId), Number(unitId)], changes);

  ctx.log.info({ unitId }, 'updated unit');
  return unit;
}
