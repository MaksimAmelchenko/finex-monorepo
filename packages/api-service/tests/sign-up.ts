// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/sign-up.ts

// tslint:disable:no-console
// tslint:disable:max-line-length

import { it } from 'mocha';
import * as should from 'should';
import * as supertest from 'supertest';
import * as Http from 'http';
import * as path from 'path';
import { IRequestContext } from '../types/app';
import { app } from '../server';
import { log } from '../libs/log';
import { sleep } from '../libs/utility';

import { errorResponseSchema } from '../common/schemas/error.response.schema';

import { validateResponse } from './libs/validate-response';
import { validateStatus } from './libs/validate-status';
import { getLastTransactionalEmail } from './libs/get-last-transactional-email';
import { UserGateway } from '../services/user/gateway';
import { createSignUpRequestResponseSchema } from '../api/v2/auth/create-sign-up-request/response.schema';
import { resendSignUpConfirmationResponseSchema } from '../api/v2/auth/resend-sign-up-confirmation/response.schema';
import { confirmSignUpRequestResponseSchema } from '../api/v2/auth/confirm-sign-up-request/response.schema';
import { sessionSchema } from '../api/v2/auth/sign-in/response.session.schema';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const time: string = Date.now().toString();
const label = `${time} ${path.basename(__filename)}`;

const ctx: IRequestContext = <IRequestContext>{ log };

describe('SignUp', function (): void {
  this.timeout(20000);

  const email = `test${time}@example.com`;
  const password = 'password';

  const signUpRequest = {
    name: `test ${label}`,
    email,
    password,
    isAcceptTerms: true,
  };

  let token: string;
  let signUpRequestId: string;
  let transactionalEmail: any;

  before(async () => {
    server = app.listen();
    request = supertest(server);
  });

  after(async () => {
    try {
      // const user = await UserGateway.getByUsername(ctx, username);

      await Promise.all([
        // SignUpRequestGateway.remove(ctx, signUpRequestId),
        // UserGateway.remove(ctx, user.id),
      ]);
    } finally {
      server.close();
    }
  });

  it('should check invalid params', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up`)
      .send({
        ...signUpRequest,
        username: 'bad email',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 400);
    validateResponse(response, errorResponseSchema);
  });

  it('should create sign-up request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up`)
      .send({
        ...signUpRequest,
        email: signUpRequest.email.toUpperCase(),
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, createSignUpRequestResponseSchema);

    signUpRequestId = response.body.signUpRequest.id;
  });

  it('should not confirm sign-up request (bad token)', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up/confirm`)
      .send({
        token: 'bad token',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 404);
    validateResponse(response, errorResponseSchema);
  });

  it('should receive email with token', async () => {
    await sleep(1000);
    transactionalEmail = await getLastTransactionalEmail(log, signUpRequest.email, 60);

    token = transactionalEmail.originalMessage.html.match(/\/sign-up\/(.*)\/confirm"/)[1];
    if (!token) {
      throw new Error('Token is not found in email');
    }
  });

  it('should resend confirmation email with token', async () => {
    await sleep(1000);

    const response: supertest.Response = await request
      .post(`/v2/sign-up/${signUpRequestId}/resend-confirmation`)
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, resendSignUpConfirmationResponseSchema);
    await sleep(1000);

    const transactionalEmailAgain = await getLastTransactionalEmail(log, signUpRequest.email, 60);
    should.notEqual(transactionalEmailAgain.messageId, transactionalEmail.messageId);

    const tokenAgain = transactionalEmailAgain.originalMessage.html.match(/\/sign-up\/(.*)\/confirm"/)[1];

    if (!tokenAgain) {
      throw new Error('Token is not found in email');
    }
    should.equal(tokenAgain, token);
  });

  it('should confirm sign-up request and create user, account and userAccount', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-up/confirm`)
      .send({
        token,
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, confirmSignUpRequestResponseSchema);
    // response.body.should.have.property('fullName').equal(signUpRequest.userFullName);

    // await sleep(5000);

    const user = await UserGateway.getByUsername(ctx, signUpRequest.email);
    //

    // user.should.have.property('passwordHint').equal(signUpRequest.passwordHint);
  });

  it('should sign-in', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username: email,
        password,
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, sessionSchema);
  });

  it('should not sign-in with wrong password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username: email,
        password: 'wrongPassword',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 401);
    validateResponse(response, errorResponseSchema);
  });
});
