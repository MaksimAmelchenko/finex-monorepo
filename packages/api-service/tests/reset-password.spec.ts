// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/reset-password.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { authorize } from '../libs/rest-api/authorize';
import { confirmResetPasswordRequestResponseSchema } from '../api/v2/auth/confirm-reset-password-request/response.schema';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { getLastTransactionalEmail } from './libs/get-last-transactional-email';
import { initUser, UserData } from './libs/init-user';
import { resetPasswordRequestResponseSchema } from '../api/v2/auth/create-reset-password-request/response.schema';
import { sessionSchema } from '../api/v2/auth/sign-in/response.session.schema';
import { signIn } from './libs/sign-in';
import { sleep } from '../libs/utility';
import { validateResponse } from './libs/validate-response';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const username = 'test@finex.io';
const password = 'password';

let signInResponse: ISessionResponse;
let userData: UserData;
let projectId: string;
let userId: string;
let ctx: IRequestContext<never, true>;

describe('Reset password', function (): void {
  this.timeout(10000);

  let token: string;
  let resetPasswordRequestId: string;
  let transactionalEmail: any;

  before(async () => {
    ctx = (await createRequestContext()) as IRequestContext<never, true>;

    server = app.listen();
    request = supertest(server);
    await deleteUser(ctx, username);

    userData = await initUser(ctx, { username, password });

    projectId = userData.user.projectId!;
    userId = userData.user.id;

    signInResponse = <ISessionResponse>await signIn(request, username, password);
    await authorize(ctx, signInResponse.authorization, '');
  });

  after(async () => {
    await deleteUser(ctx, username);
    server.close();
  });

  it('should create reset-password request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password`)
      .send({
        email: username,
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, resetPasswordRequestResponseSchema);

    resetPasswordRequestId = response.body.resetPasswordRequest.id;
  });

  it('should not confirm reset password request (bad token)', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password/confirm`)
      .send({
        token: 'bad token',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.NOT_FOUND);

    validateResponse(response, errorResponseSchema);
  });

  it('should receive email with token', async () => {
    await sleep(3000);
    transactionalEmail = await getLastTransactionalEmail(ctx, username, 60);

    // token = transactionalEmail.originalMessage.html.match(/\/reset-password\/(.*)\/confirm"/)[1];
    token = transactionalEmail.originalMessage.html.match(/\>https:\/\/finex.io\/password_recovery\/confirm\?token=(.*)\<\/a>/)[1];
    if (!token) {
      throw new Error('Token is not found in email');
    }
  });

  it('should confirm reset password request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password/confirm`)
      .send({
        token,
        password: 'newpassword',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, confirmResetPasswordRequestResponseSchema);
  });

  it('should sign-in', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username,
        password: 'newpassword',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, sessionSchema);
  });

  it('should not sign-in with prev password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username,
        password,
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);

    validateResponse(response, errorResponseSchema);
  });

  it('should not sign-in with wrong password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username,
        password: 'WrongPassword',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);

    validateResponse(response, errorResponseSchema);
  });
});
