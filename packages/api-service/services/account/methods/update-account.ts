import { AccountGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateAccountServiceChanges, UpdateAccountServiceResponse } from '../types';

export async function updateAccount(
  ctx: IRequestContext,
  accountId: string,
  changes: UpdateAccountServiceChanges
): Promise<UpdateAccountServiceResponse> {
  return AccountGateway.updateAccount(ctx, accountId, changes);
}
