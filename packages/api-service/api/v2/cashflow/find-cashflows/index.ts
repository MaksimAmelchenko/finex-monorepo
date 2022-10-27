import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { findCashFlowsParamsSchema } from './params.schema';
import { findCashFlowsResponseSchema } from './response.schema';

export const findCashFlows: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/cashflows',
  handler,
  schemas: {
    params: findCashFlowsParamsSchema,
    response: findCashFlowsResponseSchema,
  },
};
