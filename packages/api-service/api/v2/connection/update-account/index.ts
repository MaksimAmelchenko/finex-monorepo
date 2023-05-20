import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { updateAccountParamsSchema } from './params.schema';
import { updateAccountResponseSchema } from './response.schema';

export const updateAccount: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v1/connections/:connectionId/accounts/:connectionAccountId',
  handler,
  schemas: {
    params: updateAccountParamsSchema,
    response: updateAccountResponseSchema,
  },
};
