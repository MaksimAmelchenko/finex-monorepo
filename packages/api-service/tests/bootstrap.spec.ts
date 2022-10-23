// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/bootstrap.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { getEntitiesResponseSchema } from '../api/v2/entities/get/response.schema';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
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

describe('Bootstrap', function (): void {
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

    projectId = userData.user.projectId!;
    userId = userData.user.id;

    signInResponse = <ISessionResponse>await signIn(request, username, password);
    await authorize(ctx, signInResponse.authorization, '');
  });

  afterEach(async () => {
    await deleteUser(ctx, username);
  });

  describe('Get bootstrap', () => {
    it('should get bootstrap', async () => {
      const response: supertest.Response = await request
        .get('/v2/entities')
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, getEntitiesResponseSchema);
    });
  });
});
