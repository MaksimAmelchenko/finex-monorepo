import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { IDBSignUpRequest, ISignUpRequest } from '../../../../types/sign-up-request';
import { decodeDBSignUpRequest } from './decode-db-sign-up-request';

export async function getSignUpRequest(ctx: IRequestContext, id: string): Promise<ISignUpRequest> {
  const query = knex
    .select('*')
    .from('core$.signup_request')
    .where(knex.raw('id = ?', [id]))
    .toSQL()
    .toNative();

  return DB.execute<IDBSignUpRequest>(ctx.log, query.sql, query.bindings).then(decodeDBSignUpRequest);
}
