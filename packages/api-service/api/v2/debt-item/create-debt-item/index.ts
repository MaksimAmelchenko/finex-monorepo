import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createDebtItemParamsSchema } from './params.schema';
import { createDebtItemResponseSchema } from './response.schema';

export const createDebtItem: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/debts/:debtId/items',
  handler,
  schemas: {
    params: createDebtItemParamsSchema,
    response: createDebtItemResponseSchema,
  },
};
