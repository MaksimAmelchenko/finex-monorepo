import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<Record<string, never>>> {
  await dbRequest(ctx, 'cf.money.destroy', ctx.params);
  return {
    body: {},
  };
}
