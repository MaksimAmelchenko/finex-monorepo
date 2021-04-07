import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import onEnter from './on-enter';

import { signInParamsSchema } from './params.schema';
import { signInResponseSchema } from './response.schema';

export const signInRouteOptions: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/sign-in',
  handler,
  schemas: {
    params: signInParamsSchema,
    response: signInResponseSchema,
  },
  isNeedAuthorization: false,
  onEnter,
};
