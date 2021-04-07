import { createResetPasswordRequest } from './methods/create-reset-password-request';
import { getResetPasswordRequestByToken } from './methods/get-reset-password-request-by-token';
import { updateResetPasswordRequest } from './methods/update-reset-password-request';

// tslint:disable-next-line:variable-name
export const ResetPasswordRequestGateway = {
  create: createResetPasswordRequest,
  getByToken: getResetPasswordRequestByToken,
  update: updateResetPasswordRequest,
};
