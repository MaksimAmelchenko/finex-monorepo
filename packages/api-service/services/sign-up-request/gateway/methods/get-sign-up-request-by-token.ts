import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { IDBSignUpRequest, ISignUpRequest } from '../../../../types/sign-up-request';
import { decodeDBSignUpRequest } from './decode-db-sign-up-request';

export async function getSignUpRequestByToken(
  ctx: IRequestContext,
  token: string
): Promise<ISignUpRequest | undefined> {
  const query = knex
    .select('*')
    .from('core$.signup_request')
    .where(knex.raw('token = ?', [token]))
    .toSQL()
    .toNative();

  const signUpRequest: IDBSignUpRequest | undefined = await DB.execute(ctx.log, query.sql, query.bindings);

  if (!signUpRequest) {
    return undefined;
  }

  return decodeDBSignUpRequest(signUpRequest);
}
