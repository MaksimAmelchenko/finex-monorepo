import * as moment from 'moment';
import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBSignUpRequest } from './decode-db-sign-up-request';
import { IDBSignUpRequest, ISignUpRequest, IUpdateParams } from '../../../../types/sign-up-request';

export async function updateSignUpRequest(
  ctx: IRequestContext,
  signUpRequestId: string,
  data: IUpdateParams
): Promise<ISignUpRequest> {
  const query = knex('core$.signup_request')
    .where(knex.raw('id = ?', [signUpRequestId]))
    .update({
      ...data,
      updated_at: moment.utc().format(),
    })
    .returning('*')
    .toSQL()
    .toNative();

  const signUpRequest: IDBSignUpRequest = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBSignUpRequest(signUpRequest);
}
