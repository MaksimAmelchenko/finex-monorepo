import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { findOperationParamsSchema } from './params.schema';
import { findOperationsResponseSchema } from './response.schema';

export const findOperations: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/operations',
  handler,
  schemas: {
    params: findOperationParamsSchema,
    response: findOperationsResponseSchema,
  },
};
