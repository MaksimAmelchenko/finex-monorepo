import { Money } from '../../model/money';
import { IRequestContext } from '../../../../types/app';

export async function sortMoneys(ctx: IRequestContext, projectId: string, moneyIds: string[]): Promise<void> {
  ctx.log.trace({ moneyIds }, 'try to sort money');
  const idProject = Number(projectId);

  const knex = Money.knex();
  let query = knex.raw(
    `
      update cf$.money m
         set sorting = array_position(?::int[], m.id_money)
       where m.id_project = ?
    `,
    [moneyIds, idProject]
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }
  await query;

  ctx.log.info('sorted money');
}
