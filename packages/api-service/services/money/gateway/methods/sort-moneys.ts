import { Money } from '../../model/money';
import { IRequestContext } from '../../../../types/app';

export async function sortMoneys(ctx: IRequestContext, projectId: string, moneyIds: string[]): Promise<void> {
  ctx.log.trace({ moneyIds }, 'try to sort money');
  const idProject = Number(projectId);

  const knex = Money.knex();
  await knex
    .raw(
      `
      update cf$.money m
         set sorting = array_position(?::int[], m.id_money)
       where m.id_project = ?
    `,
      [moneyIds, idProject]
    )
    .transacting(ctx.trx);

  ctx.log.info('sorted money');
}
