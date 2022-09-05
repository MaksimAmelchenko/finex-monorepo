import { snakeCaseMappers } from 'objection';

import { Account } from '../../model/account';
import { IRequestContext } from '../../../../types/app';
import { Project } from '../../../project/model/project';

const { parse } = snakeCaseMappers();

export async function getAccounts(ctx: IRequestContext, projectId: string, userId: string): Promise<Account[]> {
  ctx.log.trace('try to get accounts');
  const knex = Project.knex();
  let query = knex.raw(
    `
        select a.id_account,
               a.id_account_type,
               a.id_user,
               a.name,
               a.note,
               a.is_enabled,
               7::smallint as permit,
               array(select ap.id_user
                       from cf$.account_permit ap
                      where ap.id_project = a.id_project
                        and ap.id_account = a.id_account
                        and ap.permit = 1) as "viewers",
               array(select ap.id_user
                       from cf$.account_permit ap
                      where ap.id_project = a.id_project
                        and ap.id_account = a.id_account
                        and ap.permit = 3) as "editors"
          from cf$.account a
         where a.id_project = :id_project
           and a.id_user = :id_user
         union all
        select a.id_account,
               a.id_account_type,
               a.id_user,
               a.name,
               a.note,
               a.is_enabled,
               ap.permit,
               '{}'::integer[] as viewers,
               '{}'::integer[] as editors
          from cf$.account_permit ap
                 join cf$.account a
                      using (id_project, id_account)
         where ap.id_project = :id_project
           and ap.id_user = :id_user
      `,
    {
      id_project: Number(projectId),
      id_user: Number(userId),
    }
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }
  const { rows: accounts } = await query;
  return accounts.map(account => Account.fromDatabaseJson(parse(account)));
}
