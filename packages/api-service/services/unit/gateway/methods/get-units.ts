import { IRequestContext } from '../../../../types/app';
import { Unit } from '../../model/unit';

export async function getUnits(ctx: IRequestContext, projectId: string): Promise<Unit[]> {
  ctx.log.trace('try to get units');
  return Unit.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
