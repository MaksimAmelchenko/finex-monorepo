// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/bootstrap.ts

import 'should';
import * as supertest from 'supertest';
import * as Http from 'http';

import config from '../libs/config';

import { app } from '../server';

import { IRequestContext } from '../types/app';
import { IUser } from '../types/user';
import { ISessionResponse } from '../types/auth';

import { log } from '../libs/log';
import { signIn } from './libs/sign-in';
import { validateStatus } from './libs/validate-status';
import { validateResponse } from './libs/validate-response';

import { auth } from './libs/auth';
import { UserGateway } from '../services/user/gateway';
import { getEntitiesResponseSchema } from '../api/v1/entities/get/response.schema';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const [testAccount] = config.get('testAccounts');

const { user1 } = testAccount.users;

let signInResponse: ISessionResponse;

const ctx: IRequestContext = <IRequestContext>{ log };

describe('Bootstrap', function (): void {
  let user: IUser | undefined;
  //  tslint:disable-next-line:no-invalid-this
  this.timeout(30000);

  before(async () => {
    server = app.listen();
    request = supertest(server);

    user = await UserGateway.getByUsername(ctx, user1.username);

    signInResponse = await signIn(request, user1.username, user1.password);
  });

  after(async () => {
    try {
    } finally {
      server.close();
    }
  });

  describe('Get bootstrap', () => {
    it('should get bootstrap', async () => {
      const response: supertest.Response = await request
        .get(`/v1/entities`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, getEntitiesResponseSchema);
    });
  });
});
