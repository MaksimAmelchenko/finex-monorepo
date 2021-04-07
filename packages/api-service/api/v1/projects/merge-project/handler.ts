import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const response = await dbRequest(ctx, 'cf.project.merge', ctx.params);
  return {
    body: response,
  };
}
