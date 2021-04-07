// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/auth.ts

import 'should';
import * as supertest from 'supertest';
import * as Http from 'http';

import config from '../libs/config';

import { app } from '../server';
import { signIn } from './libs/sign-in';
import { validateStatus } from './libs/validate-status';
import { validateResponse } from './libs/validate-response';
import { signInResponseSchema } from '../api/v2/auth/sign-in/response.schema';
import { errorResponseSchema } from '../common/schemas/error.response.schema';

const [testAccount] = config.get('testAccounts');
const { user1 } = testAccount.users;

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

describe('Auth', function (): void {
  this.timeout(30000);

  before(async () => {
    server = app.listen();
    request = supertest(server);
  });

  after(async () => {
    try {
    } finally {
      server.close();
    }
  });

  describe('Username must be case insensitive and tolerant to trailing spaces', () => {
    it('should sign in by lower-cased username', async () => {
      const response: supertest.Response = await request.post('/v2/sign-in').send({
        username: user1.username.toLowerCase(),
        password: user1.password,
      });

      validateStatus(response, 200);
      validateResponse(response, signInResponseSchema);
    });

    it('should sign in by upper-cased username', async () => {
      const response: supertest.Response = await request.post('/v2/sign-in').send({
        username: user1.username.toUpperCase(),
        password: user1.password,
      });

      validateStatus(response, 200);
      validateResponse(response, signInResponseSchema);
    });

    it('should sign in by username with trailing spaces', async () => {
      const response: supertest.Response = await request.post('/v2/sign-in').send({
        username: ` ${user1.username}  `,
        password: user1.password,
      });

      validateStatus(response, 200);
      validateResponse(response, signInResponseSchema);
    });

    it('should not sign in by wrong username', async () => {
      const response: supertest.Response = await request.post('/v2/sign-in').send({
        username: 'wrongUsername',
        password: user1.password,
      });

      validateStatus(response, 401);
      validateResponse(response, errorResponseSchema);
    });

    it('should not sign in by wrong password', async () => {
      const response: supertest.Response = await request.post('/v2/sign-in').send({
        username: user1.username,
        password: 'wrongPassword',
      });

      validateStatus(response, 401);
      validateResponse(response, errorResponseSchema);
    });
  });
});
