import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { changePasswordParamsSchema } from './params.schema';

export const changePassword: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/change-password',
  handler,
  schemas: {
    params: changePasswordParamsSchema,
  },
};
