import { Contractor } from '../../model/contractor';
import { IRequestContext } from '../../../../types/app';

export async function deleteContractor(ctx: IRequestContext, projectId: string, contractorId: string): Promise<void> {
  ctx.log.trace({ contractorId }, 'try to delete contractor');
  await Contractor.query(ctx.trx).deleteById([Number(projectId), Number(contractorId)]);
  ctx.log.info({ contractorId }, 'deleted contractor');
}
