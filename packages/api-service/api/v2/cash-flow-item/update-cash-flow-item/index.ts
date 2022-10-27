import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateCashFlowItemParamsSchema } from './params.schema';
import { updateCashFlowItemResponseSchema } from './response.schema';

export const updateCashFlowItem: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/cash-flows/:cashFlowId/items/:cashFlowItemId',
  handler,
  schemas: {
    params: updateCashFlowItemParamsSchema,
    response: updateCashFlowItemResponseSchema,
  },
};
