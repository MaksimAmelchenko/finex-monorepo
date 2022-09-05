import { Account } from '../model/account';
import { AccountGateway } from '../gateway';
import { CreateAccountServiceData } from '../types';
import { IRequestContext } from '../../../types/app';
import { Project } from '../../project/model/project';
import { getAccount } from './get-account';

export async function createAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  userId: string,
  data: CreateAccountServiceData
): Promise<Account> {
  ctx.log.trace({ projectId, userId, data }, 'service: try to create account');

  const { accountTypeId, name, note, isEnabled } = data;
  const editors = data.editors ? data.editors.filter(editorId => editorId !== userId) : [];
  const viewers = data.viewers
    ? data.viewers.filter(viewerId => viewerId !== userId && !editors.includes(viewerId))
    : [];

  const account = await AccountGateway.createAccount(ctx, projectId, userId, { accountTypeId, name, note, isEnabled });

  const knex = Project.knex();
  if (viewers.length) {
    let query = knex.raw(
      `
          insert into cf$.account_permit ( id_project, id_account, id_user, permit )
            (select distinct
                    :id_project::int,
                    :id_account::int,
                    value::int,
                    1
               from jsonb_array_elements_text(:viewers));
        `,
      {
        id_project: Number(projectId),
        id_account: account.idAccount,
        viewers: JSON.stringify(viewers),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;
  }

  if (editors.length) {
    let query = knex.raw(
      `
          insert into cf$.account_permit ( id_project, id_account, id_user, permit )
            (select distinct
                    :id_project::int,
                    :id_account::int,
                    value::int,
                    3
               from jsonb_array_elements_text(:editors));
        `,
      {
        id_project: Number(projectId),
        id_account: account.idAccount,
        editors: JSON.stringify(editors),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;
  }

  return getAccount(ctx, projectId, String(account.idAccount));
}
