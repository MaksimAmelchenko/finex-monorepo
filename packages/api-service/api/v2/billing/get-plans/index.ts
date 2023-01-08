import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getPlansParamsSchema } from './params.schema';
import { getPlansResponseSchema } from './response.schema';

export const getPlansRouteOptions: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/billing/plans',
  handler,
  schemas: {
    params: getPlansParamsSchema,
    response: getPlansResponseSchema,
  },
  isNeedAuthorization: false,
};
