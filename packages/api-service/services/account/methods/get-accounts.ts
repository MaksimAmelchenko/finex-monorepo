import { AccountGateway } from '../gateway';
import { GetAccountsServiceResponse, IAccount } from '../types';
import { IRequestContext } from '../../../types/app';

export async function getAccounts(ctx: IRequestContext): Promise<IAccount[]> {
  return AccountGateway.getAccounts(ctx);
}
