import { Knex } from 'knex';

export async function runInContext(ctx, knex: Knex, func: Function): Promise<void> {
  ctx.trx = await knex.transaction();
  try {
    await ctx.trx.raw('select context.set(:sessionId::uuid)', { sessionId: ctx.sessionId });
    await func(ctx);
    ctx.trx.commit();
    ctx.trx = undefined;
  } catch (err) {
    ctx.trx?.rollback();
    throw err;
  }
}
