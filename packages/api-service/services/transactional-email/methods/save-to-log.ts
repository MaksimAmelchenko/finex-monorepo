import { IRequestContext } from '../../../types/app';
import { DB, knex } from '../../../libs/db';

export async function saveToLog(ctx: IRequestContext, email: string, message: any): Promise<void> {
  const query = knex('core$.transactional_email')
    .insert({
      email: email.trim().toLowerCase(),
      message,
    })
    .toSQL()
    .toNative();

  await DB.execute(ctx.log, query.sql, query.bindings);
}
