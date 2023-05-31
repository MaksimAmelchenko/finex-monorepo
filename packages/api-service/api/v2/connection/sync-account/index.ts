import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { syncAccountParamsSchema } from './params.schema';

export const syncAccount: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/connections/:connectionId/accounts/:connectionAccountId/sync',
  handler,
  schemas: {
    params: syncAccountParamsSchema,
  },
};
