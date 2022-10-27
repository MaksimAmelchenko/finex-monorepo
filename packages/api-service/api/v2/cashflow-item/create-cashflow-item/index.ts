import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createCashFlowItemParamsSchema } from './params.schema';
import { createCashFlowItemResponseSchema } from './response.schema';

export const createCashFlowItem: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/cashflows/:cashFlowId/items',
  handler,
  schemas: {
    params: createCashFlowItemParamsSchema,
    response: createCashFlowItemResponseSchema,
  },
};
