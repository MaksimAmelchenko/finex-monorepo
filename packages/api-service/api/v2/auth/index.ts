import { getRestApi } from '../../../libs/rest-api';

import { confirmResetPasswordRequest } from './confirm-reset-password-request';
import { confirmSignUpRequest } from './confirm-sign-up-request';
import { createResetPasswordRequest } from './create-reset-password-request';
import { createSignUpRequest } from './create-sign-up-request';
import { resendSignUpConfirmation } from './resend-sign-up-confirmation';
import { signInRouteOptions } from './sign-in';
import { signOutRouteOptions } from './sign-out';

export const authApi = getRestApi([
  //
  confirmResetPasswordRequest,
  confirmSignUpRequest,
  createResetPasswordRequest,
  createSignUpRequest,
  resendSignUpConfirmation,
  signInRouteOptions,
  signOutRouteOptions,
]);
