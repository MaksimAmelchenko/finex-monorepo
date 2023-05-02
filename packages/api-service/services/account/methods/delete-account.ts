import { AccessDeniedError } from '../../../libs/errors';
import { AccountGateway } from '../gateway';
import { IRequestContext, Permit } from '../../../types/app';
import { getAccount } from './get-account';

export async function deleteAccount(
  ctx: IRequestContext<unknown, true>,
  projectId: string,
  userId: string,
  accountId: string
): Promise<void> {
  const account = await getAccount(ctx, projectId, userId, accountId);
  if (account.permit !== Permit.Owner) {
    throw new AccessDeniedError();
  }

  return AccountGateway.deleteAccount(ctx, projectId, accountId);
}
