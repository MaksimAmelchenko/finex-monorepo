import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { confirmResetPasswordRequestParamsSchema } from './params.schema';
import { confirmResetPasswordRequestResponseSchema } from './response.schema';

export const confirmResetPasswordRequest: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/reset-password/confirm',
  handler,
  schemas: {
    params: confirmResetPasswordRequestParamsSchema,
    response: confirmResetPasswordRequestResponseSchema,
  },
  isNeedAuthorization: false,
};
