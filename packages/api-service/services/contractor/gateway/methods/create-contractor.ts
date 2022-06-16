import { Contractor } from '../../model/contractor';
import { IRequestContext } from '../../../../types/app';
import { CreateContractorGatewayData } from '../../types';

export async function createContractor(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateContractorGatewayData
): Promise<Contractor> {
  ctx.log.trace({ data }, 'try to create contractor');

  const contractor = await Contractor.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    ...data,
  });

  ctx.log.info({ contractorId: contractor.idContractor }, 'created contractor');
  return contractor;
}
