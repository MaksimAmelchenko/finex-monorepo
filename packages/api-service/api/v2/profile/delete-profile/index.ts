import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { deleteProfileParamsSchema } from './params.schema';

export const deleteProfile: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/profile',
  handler,
  schemas: {
    params: deleteProfileParamsSchema,
  },
};
