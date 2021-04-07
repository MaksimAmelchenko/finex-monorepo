import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBResetPasswordRequest } from './decode-db-reset-password-request';
import { IDBResetPasswordRequest, IResetPasswordRequest } from '../../../../types/reset-password-request';

export async function getResetPasswordRequestByToken(
  ctx: IRequestContext,
  token: string
): Promise<IResetPasswordRequest | undefined> {
  const query = knex
    .select('*')
    .from('core$.password_recovery_request')
    .where(knex.raw('token = ?', [token]))
    .toSQL()
    .toNative();

  const resetPasswordRequest: IDBResetPasswordRequest | undefined = await DB.execute<IDBResetPasswordRequest>(
    ctx.log,
    query.sql,
    query.bindings
  );

  if (!resetPasswordRequest) {
    return undefined;
  }

  return decodeDBResetPasswordRequest(resetPasswordRequest);
}
