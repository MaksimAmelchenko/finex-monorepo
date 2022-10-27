import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteCashFlowParamsSchema } from './params.schema';

export const deleteCashFlow: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/cash-flows/:cashFlowId',
  handler,
  schemas: {
    params: deleteCashFlowParamsSchema,
  },
};
