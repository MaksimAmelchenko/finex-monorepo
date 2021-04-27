import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<Record<any, never>>> {
  const { params } = ctx;
  ctx.log.warn({ params }, 'Amazon SES Notification');
  return {
    body: {},
  };
}
