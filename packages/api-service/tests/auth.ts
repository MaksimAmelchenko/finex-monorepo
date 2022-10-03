// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/auth.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { authorize } from '../libs/rest-api/authorize';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { signInResponseSchema } from '../api/v2/auth/sign-in/response.schema';
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

describe('Auth', function (): void {
  this.timeout(10000);

  before(async () => {
    ctx = (await createRequestContext()) as IRequestContext<never, true>;

    server = app.listen();
    request = supertest(server);
    await deleteUser(ctx, username);
  });

  after(async () => {
    try {
    } finally {
      server.close();
    }
  });

  beforeEach(async () => {
    userData = await initUser(ctx, { username, password });

    projectId = String(userData.user.idProject);
    userId = String(userData.user.idUser);

    signInResponse = <ISessionResponse>await signIn(request, username, password);
    await authorize(ctx, signInResponse.authorization, '');
  });

  afterEach(async () => {
    await deleteUser(ctx, username);
  });

  describe('Username must be case insensitive and tolerant to trailing spaces', () => {
    it('should sign in by lower-cased username', async () => {
      const response: supertest.Response = await request
        .post('/v2/sign-in')
        .send({
          username: ` ${username.toUpperCase()} `,
          password,
        })
        .expect(StatusCodes.OK);

      validateResponse(response, signInResponseSchema);
    });

    it('should not sign in by wrong username', async () => {
      const response: supertest.Response = await request
        .post('/v2/sign-in')
        .send({
          username: 'wrongUsername',
          password,
        })
        .expect(StatusCodes.UNAUTHORIZED);

      validateResponse(response, errorResponseSchema);
    });

    it('should not sign in by wrong password', async () => {
      const response: supertest.Response = await request
        .post('/v2/sign-in')
        .send({
          username,
          password: 'wrongPassword',
        })
        .expect(StatusCodes.UNAUTHORIZED);

      validateResponse(response, errorResponseSchema);
    });
  });
});
