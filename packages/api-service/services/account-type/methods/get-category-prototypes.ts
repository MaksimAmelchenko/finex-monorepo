import { AccountType } from '../model/account-type';
import { AccountTypeGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getAccountTypes(ctx: IRequestContext): Promise<AccountType[]> {
  return AccountTypeGateway.getAccountTypes(ctx);
}
