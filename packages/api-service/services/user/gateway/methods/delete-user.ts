import { IRequestContext } from '../../../../types/app';
import { User } from '../../model/user';

export async function deleteUser(ctx: IRequestContext, userId: string): Promise<void> {
  ctx.log.trace({ userId }, 'try to delete user');

  // await User.query(ctx.trx)
  //   .del()
  //   .where({
  //     idUser: String(userId),
  //   });

  const trx = ctx.trx || (await User.knex().transaction());

  await trx.raw(`select context.set('isNotCheckPermit', '1')`);
  await trx('core$.user')
    .del()
    .where({
      idUser: String(userId),
    });
  await trx.raw(`select context.set('isNotCheckPermit', '')`);

  if (!ctx.trx) {
    trx.commit();
  }
}
