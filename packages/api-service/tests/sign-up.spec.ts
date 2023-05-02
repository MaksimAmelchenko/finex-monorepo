// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/sign-up.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';

import { IRequestContext } from '../types/app';
import { app } from '../server';
import { confirmSignUpRequestResponseSchema } from '../api/v2/auth/confirm-sign-up-request/response.schema';
import { createRequestContext } from './libs/create-request-context';
import { createSignUpRequestResponseSchema } from '../api/v2/auth/create-sign-up-request/response.schema';
import { deleteUser } from './libs/delete-user';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { getLastTransactionalEmail } from './libs/get-last-transactional-email';
import { resendSignUpConfirmationResponseSchema } from '../api/v2/auth/resend-sign-up-confirmation/response.schema';
import { sessionSchema } from '../api/v2/auth/sign-in/response.session.schema';
import { sleep } from '../libs/utility';
import { validateResponse } from './libs/validate-response';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const username = 'test@finex.io';
const password = 'password';

let ctx: IRequestContext<never, true>;

describe('SignUp', function (): void {
  this.timeout(10000);

  const signUpRequest = {
    name: 'Name',
    email: username,
    password,
    isAcceptTerms: true,
    locale: 'en',
  };

  let token: string;
  let signUpRequestId: string;
  let transactionalEmail: any;

  before(async () => {
    ctx = (await createRequestContext()) as IRequestContext<never, true>;
    server = app.listen();
    request = supertest(server);
    await deleteUser(ctx, username);
  });

  after(async () => {
    await deleteUser(ctx, username);
    server.close();
  });

  it('should check invalid params', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up`)
      .send({
        ...signUpRequest,
        username: 'bad email',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST);

    validateResponse(response, errorResponseSchema);
  });

  it('should create sign-up request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up`)
      .set({ origin: 'https://app.finex.io' })
      .send(signUpRequest)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, createSignUpRequestResponseSchema);

    signUpRequestId = response.body.signUpRequest.id;
  });

  it('should not confirm sign-up request (bad token)', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up/confirm`)
      .send({
        token: 'bad token',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.NOT_FOUND);

    validateResponse(response, errorResponseSchema);
  });

  it('should receive email with token', async () => {
    await sleep(1000);
    transactionalEmail = await getLastTransactionalEmail(ctx, signUpRequest.email, 60);

    token = transactionalEmail.originalMessage.html.match(
      /\>https:\/\/app.finex.io\/sign-up\/confirmation\?token=(.*)&amp;locale=en\<\/a>/
    )[1];
    if (!token) {
      throw new Error('Token is not found in email');
    }
  });

  it('should resend confirmation email with token', async () => {
    await sleep(1000);

    const response: supertest.Response = await request
      .post(`/v2/sign-up/${signUpRequestId}/resend-confirmation`)
      .send({
        locale: 'en'
      })
      .set({ origin: 'https://app.finex.io' })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, resendSignUpConfirmationResponseSchema);
    await sleep(1000);

    const transactionalEmailAgain = await getLastTransactionalEmail(ctx, signUpRequest.email, 60);
    expect(transactionalEmailAgain.messageId).be.not.equal(transactionalEmail.messageId);

    const tokenAgain = transactionalEmailAgain.originalMessage.html.match(
      /\>https:\/\/app.finex.io\/sign-up\/confirmation\?token=(.*)&amp;locale=en\<\/a>/
    )[1];

    if (!tokenAgain) {
      throw new Error('Token is not found in email');
    }
    expect(tokenAgain).be.equal(token);
  });

  it('should confirm sign-up request and create user, account and userAccount', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up/confirm`)
      .send({
        token,
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, confirmSignUpRequestResponseSchema);

    // const user = await UserGateway.getUserByUsername(ctx, signUpRequest.email);
    //

    // user.should.have.property('passwordHint').equal(signUpRequest.passwordHint);
  });

  it('should sign-in', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username,
        password,
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK);

    validateResponse(response, sessionSchema);
  });

  it('should not sign-in with wrong password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username,
        password: 'wrongPassword',
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);

    validateResponse(response, errorResponseSchema);
  });
});
