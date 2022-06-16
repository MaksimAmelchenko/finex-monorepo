import { IRequestContext } from '../../../../types/app';
import { Contractor } from '../../model/contractor';

export async function getContractors(ctx: IRequestContext, projectId: string): Promise<Contractor[]> {
  ctx.log.trace('try to get contractor');
  return Contractor.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
