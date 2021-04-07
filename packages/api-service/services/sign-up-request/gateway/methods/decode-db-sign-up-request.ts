import { IDBSignUpRequest, ISignUpRequest } from '../../../../types/sign-up-request';

export function decodeDBSignUpRequest(signUpRequest: IDBSignUpRequest): ISignUpRequest {
  return {
    id: signUpRequest.id,
    token: signUpRequest.token,
    email: signUpRequest.email,
    name: signUpRequest.name,
    password: signUpRequest.password,
    confirmedAt: signUpRequest.confirmed_at,
    metadata: {
      createdAt: signUpRequest.created_at,
      updatedAt: signUpRequest.updated_at,
    },
  };
}
