import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createCashFlowParamsSchema } from './params.schema';
import { createCashFlowResponseSchema } from './response.schema';

export const createCashFlow: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/cash-flows',
  handler,
  schemas: {
    params: createCashFlowParamsSchema,
    response: createCashFlowResponseSchema,
  },
};
