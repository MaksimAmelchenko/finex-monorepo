import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { UpdateAccountGatewayChanges, UpdateAccountGatewayResponse } from '../../types';
import { decodeAccount } from './decode-account';
import { skipUndefined } from '../../../../libs/skip-undefined';

export async function updateAccount(
  ctx: IRequestContext,
  accountId: string,
  changes: UpdateAccountGatewayChanges
): Promise<UpdateAccountGatewayResponse> {
  ctx.log.trace({ changes }, 'try to update account');

  const { name, accountTypeId, isEnabled, note, readers, writers } = changes;

  const params: any = {
    idAccount: Number(accountId),
    name,
    isEnabled,
    note,
  };

  if (accountTypeId !== undefined) {
    params.idAccountType = Number(accountTypeId);
  }

  if (readers !== undefined) {
    params.readers = readers.map(Number);
  }

  if (writers !== undefined) {
    params.writers = writers.map(Number);
  }

  const response = await dbRequest(ctx, 'cf.account.update', skipUndefined(params));

  const account = decodeAccount(response.account);

  ctx.log.info({ accountId: account.id }, 'updated account');

  return account;
}
