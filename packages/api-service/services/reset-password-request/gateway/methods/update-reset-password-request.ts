import * as moment from 'moment';
import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBResetPasswordRequest } from './decode-db-reset-password-request';
import {
  IDBResetPasswordRequest,
  IResetPasswordRequest,
  IUpdateParams,
} from '../../../../types/reset-password-request';

export async function updateResetPasswordRequest(
  ctx: IRequestContext,
  resetPasswordRequestId: string,
  params: IUpdateParams
): Promise<IResetPasswordRequest> {
  const query = knex('core$.password_recovery_request')
    .where(knex.raw('id = ?', [resetPasswordRequestId]))
    .update({
      ...params,
      updated_at: moment.utc().format(),
    })
    .returning('*')
    .toSQL()
    .toNative();

  return DB.execute<IDBResetPasswordRequest>(ctx.log, query.sql, query.bindings).then(decodeDBResetPasswordRequest);
}
