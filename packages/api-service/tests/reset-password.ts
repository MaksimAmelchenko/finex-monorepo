// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/reset-password.ts

import { it } from 'mocha';
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
import { sessionSchema } from '../api/v2/auth/sign-in/response.session.schema';
import { resetPasswordRequestParamsSchema } from '../api/v2/auth/create-reset-password-request/params.schema';
import { confirmResetPasswordRequestResponseSchema } from '../api/v2/auth/confirm-reset-password-request/response.schema';
import config from '../libs/config';
import { UserGateway } from '../services/user/gateway';
import { hashPassword } from '../services/auth/methods/hash-password';
import { resetPasswordRequestResponseSchema } from '../api/v2/auth/create-reset-password-request/response.schema';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const time: string = Date.now().toString();
const label = `${time} ${path.basename(__filename)}`;

const ctx: IRequestContext = <IRequestContext>{ log };
const [testAccount] = config.get('testAccounts');
const { user1 } = testAccount.users;

describe('Reset password', function (): void {
  this.timeout(20000);

  let token: string;
  let resetPasswordRequestId: string;
  let transactionalEmail: any;

  before(async () => {
    server = app.listen();
    request = supertest(server);
  });

  after(async () => {
    try {
      const user = await UserGateway.getByUsername(ctx, user1.username);
      await UserGateway.update(ctx, user!.id, { password: await hashPassword(user1.password) });
    } finally {
      server.close();
    }
  });

  it('should create reset-password request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password`)
      .send({
        email: user1.username,
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, resetPasswordRequestResponseSchema);

    resetPasswordRequestId = response.body.resetPasswordRequest.id;
  });

  it('should not confirm reset password request (bad token)', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password/confirm`)
      .send({
        token: 'bad token',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 404);
    validateResponse(response, errorResponseSchema);
  });

  it('should receive email with token', async () => {
    await sleep(1000);
    transactionalEmail = await getLastTransactionalEmail(log, user1.username, 60);

    token = transactionalEmail.originalMessage.html.match(/\/reset-password\/(.*)\/confirm"/)[1];
    if (!token) {
      throw new Error('Token is not found in email');
    }
  });

  it('should confirm reset password request', async () => {
    const response: supertest.Response = await request
      .post(`/v2/reset-password/confirm`)
      .send({
        token,
        password: 'password',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, confirmResetPasswordRequestResponseSchema);
  });

  it('should sign-in', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username: user1.username,
        password: 'password',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 200);
    validateResponse(response, sessionSchema);
  });

  it('should not sign-in with prev password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username: user1.username,
        password: user1.password,
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 401);
    validateResponse(response, errorResponseSchema);
  });

  it('should not sign-in with wrong password', async () => {
    const response: supertest.Response = await request
      .post(`/v2/sign-in`)
      .send({
        username: user1.username,
        password: 'WrongPassword',
      })
      .expect('Content-Type', /json/);

    validateStatus(response, 401);
    validateResponse(response, errorResponseSchema);
  });
});
