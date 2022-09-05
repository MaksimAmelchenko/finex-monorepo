import * as isEmpty from 'lodash.isempty';
import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { NotFoundError } from '../../../../libs/errors';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const response = await dbRequest(ctx, 'cf.account.get', ctx.params);

  if (isEmpty(response.account)) {
    throw new NotFoundError('Account not found');
  }

  return {
    body: response,
  };
}
