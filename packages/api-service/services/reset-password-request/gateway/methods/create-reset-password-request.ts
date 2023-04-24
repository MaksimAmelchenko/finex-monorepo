import * as uuid from 'uuid';
import { DB, knex } from '../../../../libs/db';
import { normalizeEmail } from '../../../../libs/utility';

import { IRequestContext } from '../../../../types/app';
import {
  CreateResetPasswordRequestRepositoryData,
  IDBResetPasswordRequest,
  IResetPasswordRequest,
} from '../../../../types/reset-password-request';
import { decodeDBResetPasswordRequest } from './decode-db-reset-password-request';

export async function createResetPasswordRequest(
  ctx: IRequestContext,
  params: CreateResetPasswordRequestRepositoryData
): Promise<IResetPasswordRequest> {
  const { ip } = params;
  const email: string = normalizeEmail(params.email);

  const id: string = uuid.v4();
  const token: string = uuid.v4();

  const query = knex('core$.password_recovery_request')
    .insert({
      id,
      token,
      email,
      ip,
    })
    .returning('*')
    .toSQL()
    .toNative();

  return DB.execute<IDBResetPasswordRequest>(ctx.log, query.sql, query.bindings).then(decodeDBResetPasswordRequest);
}
