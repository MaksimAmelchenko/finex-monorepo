import { Unit } from '../../model/unit';
import { IRequestContext } from '../../../../types/app';
import { CreateUnitGatewayData } from '../../types';

export async function createUnit(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateUnitGatewayData
): Promise<Unit> {
  ctx.log.trace({ data }, 'try to create unit');

  const unit = await Unit.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    ...data,
  });

  ctx.log.info({ unitId: unit.idUnit }, 'created unit');
  return unit;
}
