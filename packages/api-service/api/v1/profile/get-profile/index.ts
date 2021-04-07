import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getProfileParamsSchema } from './params.schema';
import { getProfileResponseSchema } from './response.schema';

export const getProfile: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/profile',
  handler,
  schemas: {
    params: getProfileParamsSchema,
    response: getProfileResponseSchema,
  },
};
