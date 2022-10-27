import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteCashFlowItemParamsSchema } from './params.schema';

export const deleteCashFlowItem: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/cashflows/:cashFlowId/items/:cashFlowItemId',
  handler,
  schemas: {
    params: deleteCashFlowItemParamsSchema,
  },
};
