import dbRequest from '../../../../libs/db-request';
import { CreateAccountGatewayData, CreateAccountGatewayResponse } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { decodeAccount } from './decode-account';

export async function createAccount(
  ctx: IRequestContext,
  data: CreateAccountGatewayData
): Promise<CreateAccountGatewayResponse> {
  ctx.log.trace({ data }, 'try to create account');

  const { name, accountTypeId, isEnabled, note, readers = [], writers = [] } = data;

  const response = await dbRequest(ctx, 'cf.account.create', {
    name,
    idAccountType: Number(accountTypeId),
    isEnabled,
    note,
    readers: readers.map(Number),
    writers: writers.map(Number),
  });

  const account = decodeAccount(response.account);

  ctx.log.info({ accountId: account.id }, 'created account');

  return account;
}
