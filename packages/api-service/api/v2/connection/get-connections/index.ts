import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getConnectionsParamsSchema } from './params.schema';
import { getConnectionsResponseSchema } from './response.schema';

export const getConnections: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/connections',
  handler,
  schemas: {
    params: getConnectionsParamsSchema,
    response: getConnectionsResponseSchema,
  },
};
