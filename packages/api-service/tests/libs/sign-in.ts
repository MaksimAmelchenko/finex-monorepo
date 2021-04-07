import * as supertest from 'supertest';
import { signInResponseSchema } from '../../api/v2/auth/sign-in/response.schema';
import { TSignInResponse } from '../../types/auth';
import { validateResponse } from './validate-response';
import { validateStatus } from './validate-status';

export async function signIn(
  request: supertest.SuperTest<supertest.Test>,
  username: string,
  password: string
): Promise<TSignInResponse> {
  const response: supertest.Response = await request.post('/v2/sign-in').send({
    username,
    password,
  });

  validateStatus(response, 200);
  validateResponse(response, signInResponseSchema);

  return response.body;
}
