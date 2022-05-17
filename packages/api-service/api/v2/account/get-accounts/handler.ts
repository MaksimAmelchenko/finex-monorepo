import { AccountService } from '../../../../services/account';
import { IPublicAccount } from '../../../../services/account/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<{ accounts: IPublicAccount[] }>> {
  const accounts = await AccountService.getAccounts(ctx);

  return {
    body: {
      accounts,
    },
  };
}
