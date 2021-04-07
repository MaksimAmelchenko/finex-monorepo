import { confirmSignUpRequest } from './methods/confirm-sign-up-request';
import { createSignUpRequest } from './methods/create-sign-up-request';
import { resendSignUpConfirmation } from './methods/resend-sign-up-confirmation';

// tslint:disable-next-line:variable-name
export const SignUpRequest = {
  confirm: confirmSignUpRequest,
  create: createSignUpRequest,
  resend: resendSignUpConfirmation,
};
