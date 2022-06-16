import { Account } from '../model/account';
import { AccountGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getAccounts(ctx: IRequestContext, projectId: string, userId: string): Promise<Account[]> {
  return AccountGateway.getAccounts(ctx, projectId, userId);
}
