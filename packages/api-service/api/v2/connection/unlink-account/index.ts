import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { unlinkAccountParamsSchema } from './params.schema';
import { unlinkAccountResponseSchema } from './response.schema';

export const unlinkAccount: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v1/connections/:connectionId/accounts/:connectionAccountId/unlink',
  handler,
  schemas: {
    params: unlinkAccountParamsSchema,
    response: unlinkAccountResponseSchema,
  },
};
