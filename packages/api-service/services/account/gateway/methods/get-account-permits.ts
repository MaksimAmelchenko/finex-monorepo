import { AccountPermit } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { Project } from '../../../project/model/project';

export async function getAccountPermits(
  ctx: IRequestContext,
  projectId: string,
  userId: string
): Promise<AccountPermit[]> {
  ctx.log.trace('try to get account permits');
  const knex = Project.knex();
  let query = knex.raw(
    `
        select a.id_account as "accountId",
               7 as permit
          from cf$.account a
         where a.id_project = :projectId::int
           and a.id_user = :userId::int
         union all
        select ap.id_account,
               ap.permit
          from cf$.account_permit ap
         where ap.id_project = :projectId::int
           and ap.id_user = :userId::int
      `,
    {
      projectId: Number(projectId),
      userId: Number(userId),
    }
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }
  const { rows: accountPermits } = await query;

  return accountPermits;
}
