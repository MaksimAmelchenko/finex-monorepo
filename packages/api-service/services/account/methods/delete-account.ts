import { IRequestContext } from '../../../types/app';
import { AccountGateway } from '../gateway';

export async function deleteAccount(ctx: IRequestContext, accountId: string): Promise<void> {
  return AccountGateway.deleteAccount(ctx, accountId);
}
