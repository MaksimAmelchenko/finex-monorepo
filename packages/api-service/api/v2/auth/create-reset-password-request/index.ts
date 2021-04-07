import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { resetPasswordRequestParamsSchema } from './params.schema';
import { resetPasswordRequestResponseSchema } from './response.schema';
import { onEnter } from './on-enter';

export const createResetPasswordRequest: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/reset-password',
  handler,
  schemas: {
    params: resetPasswordRequestParamsSchema,
    response: resetPasswordRequestResponseSchema,
  },
  isNeedAuthorization: false,
  onEnter,
};
