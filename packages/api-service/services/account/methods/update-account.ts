import { AccessDeniedError } from '../../../libs/errors';
import { Account } from '../model/account';
import { AccountGateway } from '../gateway';
import { IRequestContext, Permit } from '../../../types/app';
import { UpdateAccountServiceChanges } from '../types';
import { getAccount } from './get-account';

export async function updateAccount(
  ctx: IRequestContext,
  projectId: string,
  accountId: string,
  changes: UpdateAccountServiceChanges
): Promise<Account> {
  const { userId } = ctx;
  const { accountTypeId, name, note, isEnabled } = changes;
  const editors = changes.editors ? changes.editors.filter(editorId => editorId !== userId) : undefined;
  const viewers = changes.viewers
    ? changes.viewers.filter(viewerId => viewerId !== userId && !editors?.includes(viewerId))
    : undefined;

  const account = await getAccount(ctx, projectId, accountId);

  if (account.permit !== Permit.Owner) {
    throw new AccessDeniedError();
  }

  await AccountGateway.updateAccount(ctx, projectId, accountId, {
    accountTypeId,
    name,
    note,
    isEnabled,
  });

  const knex = Account.knex();

  if (editors) {
    let query = knex.raw(
      `
          delete
            from cf$.account_permit ap
           where ap.id_project = :id_project::int
             and ap.id_account = :id_account::int
             and ap.permit = 3
             and ap.id_user not in (select jsonb_array_elements_text(:editors)::int);
        `,
      {
        id_project: Number(projectId),
        id_account: Number(accountId),
        editors: JSON.stringify(editors),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;

    if (editors.length) {
      let query = knex.raw(
        `
            insert
              into cf$.account_permit ( id_project, id_account, id_user, permit )
                (select :id_project::int,
                        :id_account::int,
                        value::int,
                        3 as permit
                   from jsonb_array_elements_text(:editors))
                on conflict (id_project, id_account, id_user)
                  do update set permit=3
          `,
        {
          id_project: Number(projectId),
          id_account: Number(accountId),
          editors: JSON.stringify(editors),
        }
      );
      if (ctx.trx) {
        query = query.transacting(ctx.trx);
      }
      await query;
    }
  }

  if (viewers) {
    let query = knex.raw(
      `
          delete
            from cf$.account_permit ap
           where ap.id_project = :id_project::int
             and ap.id_account = :id_account::int
             and ap.permit = 1
             and ap.id_user not in (select jsonb_array_elements_text(:viewers)::int)
        `,
      {
        id_project: Number(projectId),
        id_account: Number(accountId),
        viewers: JSON.stringify(viewers),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;

    if (viewers.length) {
      let query = knex.raw(
        `
            insert
              into cf$.account_permit ( id_project, id_account, id_user, permit )
                (select :id_project::int,
                        :id_account::int,
                        value::int,
                        1 as permit
                   from jsonb_array_elements_text(:viewers))
                on conflict (id_project, id_account, id_user)
                  do nothing
          `,
        {
          id_project: Number(projectId),
          id_account: Number(accountId),
          viewers: JSON.stringify(viewers),
        }
      );
      if (ctx.trx) {
        query = query.transacting(ctx.trx);
      }
      await query;
    }
  }

  return getAccount(ctx, projectId, accountId);
}
