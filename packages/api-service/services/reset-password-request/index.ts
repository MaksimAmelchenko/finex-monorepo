import { confirmResetPasswordRequest } from './methods/confirm-reset-password-request';
import { createResetPasswordRequest } from './methods/create-reset-password-request';

export const ResetPasswordRequest = {
  confirm: confirmResetPasswordRequest,
  create: createResetPasswordRequest,
};
