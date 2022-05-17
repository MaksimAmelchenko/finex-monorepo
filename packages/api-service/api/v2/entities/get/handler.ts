import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { AccountService } from '../../../../services/account';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const [response, accounts] = await Promise.all([
    //
    dbRequest(ctx, 'cf.entity.get', {}),
    AccountService.getAccounts(ctx),
  ]);

  return {
    body: {
      ...response,
      accounts,
    },
  };
}
