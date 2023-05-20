import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { deleteConnectionsParamsSchema } from './params.schema';

export const deleteConnection: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/connections/:connectionId',
  handler,
  schemas: {
    params: deleteConnectionsParamsSchema,
  },
};
