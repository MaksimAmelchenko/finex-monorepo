import { FindTransactionsAPIQuery } from '../../../../modules/transaction/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { operationService } from '../../../../modules/operation/operation.service';

export async function handler(ctx: IRequestContext<FindTransactionsAPIQuery, true>): Promise<IResponse<any>> {
  const {
    projectId,
    userId,
    params: { offset = 0, limit = 50, sign, searchText, startDate, endDate, accounts, categories, contractors, tags },
  } = ctx;

  const params = {
    offset,
    limit,
    sign,
    searchText,
    startDate,
    endDate,
    accounts: accounts ? accounts.split(',') : undefined,
    categories: categories ? categories.split(',') : undefined,
    contractors: contractors ? contractors.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  };

  const { metadata, operations } = await operationService.findOperations(ctx, projectId, userId, params);

  return {
    body: {
      metadata,
      operations,
    },
  };
}
