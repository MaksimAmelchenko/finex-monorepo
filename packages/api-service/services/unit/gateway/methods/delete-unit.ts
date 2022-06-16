import { Unit } from '../../model/unit';
import { IRequestContext } from '../../../../types/app';

export async function deleteUnit(ctx: IRequestContext, projectId: string, unitId: string): Promise<void> {
  ctx.log.trace({ unitId }, 'try to delete unit');
  await Unit.query(ctx.trx).deleteById([Number(projectId), Number(unitId)]);
  ctx.log.info({ unitId }, 'deleted unit');
}
