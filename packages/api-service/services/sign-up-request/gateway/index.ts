import { createSignUpRequest } from './methods/create-sign-up-request';
import { getSignUpRequest } from './methods/get-sign-up-request';
import { getSignUpRequestByToken } from './methods/get-sign-up-request-by-token';
import { updateSignUpRequest } from './methods/update-sign-up-request';

// tslint:disable-next-line:variable-name
export const SignUpRequestGateway = {
  create: createSignUpRequest,
  get: getSignUpRequest,
  getByToken: getSignUpRequestByToken,
  update: updateSignUpRequest,
};
