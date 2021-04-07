import * as uuid from 'uuid';
import { DB, knex } from '../../../../libs/db';
import { normalizeEmail } from '../../../../libs/utility';

import { IRequestContext } from '../../../../types/app';
import { ICreateParams, IDBSignUpRequest, ISignUpRequest } from '../../../../types/sign-up-request';
import { decodeDBSignUpRequest } from './decode-db-sign-up-request';

export async function createSignUpRequest(ctx: IRequestContext, params: ICreateParams): Promise<ISignUpRequest> {
  const { name, password } = params;
  const email: string = normalizeEmail(params.email);

  const id: string = uuid.v4();
  const token: string = uuid.v4();

  const query = knex('core$.signup_request')
    .insert({
      id,
      token,
      email,
      name,
      password,
    })
    .returning('*')
    .toSQL()
    .toNative();

  const signUpRequest: IDBSignUpRequest = await DB.execute(ctx.log, query.sql, query.bindings);

  return decodeDBSignUpRequest(signUpRequest);
}
