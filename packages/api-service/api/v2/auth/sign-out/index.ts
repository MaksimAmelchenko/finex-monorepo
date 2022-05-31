import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { signOutParamsSchema } from './params.schema';
import { signOutResponseSchema } from './response.schema';

export const signOutRouteOptions: RestRouteOptions<any, true> = {
  method: RestMethod.Post,
  uri: '/v1/sign-out',
  handler,
  schemas: {
    params: signOutParamsSchema,
    response: signOutResponseSchema,
  },
};
