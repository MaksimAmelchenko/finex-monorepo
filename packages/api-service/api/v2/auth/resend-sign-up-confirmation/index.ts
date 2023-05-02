import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { onEnter } from './on-enter';

import { resendSignUpConfirmationParamsSchema } from './params.schema';
import { resendSignUpConfirmationResponseSchema } from './response.schema';

export const resendSignUpConfirmation: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/sign-up/:signUpRequestId/resend-confirmation',
  handler,
  schemas: {
    params: resendSignUpConfirmationParamsSchema,
    response: resendSignUpConfirmationResponseSchema,
  },
  onEnter,
  isNeedAuthorization: false,
};
