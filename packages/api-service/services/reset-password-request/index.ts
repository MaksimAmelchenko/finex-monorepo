import { confirmResetPasswordRequest } from './methods/confirm-reset-password-request';
import { createResetPasswordRequest } from './methods/create-reset-password-request';

// tslint:disable-next-line:variable-name
export const ResetPasswordRequest = {
  confirm: confirmResetPasswordRequest,
  create: createResetPasswordRequest,
};
