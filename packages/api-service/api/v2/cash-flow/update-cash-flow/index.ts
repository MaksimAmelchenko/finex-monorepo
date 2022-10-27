import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateCashFlowParamsSchema } from './params.schema';
import { updateCashFlowResponseSchema } from './response.schema';

export const updateCashFlow: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/cash-flows/:cashFlowId',
  handler,
  schemas: {
    params: updateCashFlowParamsSchema,
    response: updateCashFlowResponseSchema,
  },
};
