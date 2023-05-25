import { Contractor } from '../../model/contractor';
import { IRequestContext } from '../../../../types/app';

export async function getContractorByName(
  ctx: IRequestContext,
  projectId: string,
  name: string
): Promise<Contractor | undefined> {
  ctx.log.trace('try to get contractor by name');
  return Contractor.query(ctx.trx)
    .where('idProject', '=', Number(projectId))
    .andWhereRaw('UPPER(name) = ?', [name.toUpperCase()])
    .first();
}
