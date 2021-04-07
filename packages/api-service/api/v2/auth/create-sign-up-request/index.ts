import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { createSignUpRequestParamsSchema } from './params.schema';
import { createSignUpRequestResponseSchema } from './response.schema';
import { onEnter } from './on-enter';

export const createSignUpRequest: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/sign-up',
  handler,
  onEnter,
  schemas: {
    params: createSignUpRequestParamsSchema,
    response: createSignUpRequestResponseSchema,
  },
  isNeedAuthorization: false,
};
