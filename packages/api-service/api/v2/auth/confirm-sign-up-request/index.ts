import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { confirmSignUpRequestParamsSchema } from './params.schema';
import { confirmSignUpRequestResponseSchema } from './response.schema';

export const confirmSignUpRequest: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/sign-up/confirm',
  handler,
  schemas: {
    params: confirmSignUpRequestParamsSchema,
    response: confirmSignUpRequestResponseSchema,
  },
  isNeedAuthorization: false,
};
