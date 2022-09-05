import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const response = await dbRequest(ctx, 'cf.account.balance', ctx.params);
  return {
    body: response,
  };
}
