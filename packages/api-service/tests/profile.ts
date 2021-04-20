// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/profile.ts

import 'should';
import * as supertest from 'supertest';
import * as Http from 'http';

import config from '../libs/config';

import { app } from '../server';

import { IRequestContext } from '../types/app';
import { IUser } from '../types/user';
import { IProfile } from '../types/profile';
import { ISessionResponse } from '../types/auth';

import { log } from '../libs/log';
import { signIn } from './libs/sign-in';
import { validateStatus } from './libs/validate-status';
import { validateResponse } from './libs/validate-response';

import { getProfileResponseSchema } from '../api/v1/profile/get-profile/response.schema';
import { updateProfileResponseSchema } from '../api/v1/profile/update-profile/response.schema';

import { auth } from './libs/auth';
import { UserGateway } from '../services/user/gateway';
import { errorResponseSchema } from '../common/schemas/error.response.schema';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const [testAccount] = config.get('testAccounts');

const { user1 } = testAccount.users;

let signInResponse: ISessionResponse;

const ctx: IRequestContext = <IRequestContext>{ log };

describe('Profile', function (): void {
  let user: IUser | undefined;
  //  tslint:disable-next-line:no-invalid-this
  this.timeout(30000);

  before(async () => {
    server = app.listen();
    request = supertest(server);

    user = await UserGateway.getByUsername(ctx, user1.username);

    signInResponse = <ISessionResponse>await signIn(request, user1.username, user1.password);
  });

  after(async () => {
    try {
      if (user) {
        await UserGateway.update(ctx, user.id, {
          name: user.name,
        });
      }
    } finally {
      server.close();
    }
  });

  describe('Get Profile', () => {
    it('should get profile', async () => {
      const response: supertest.Response = await request
        .get(`/v1/profile`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, getProfileResponseSchema);
    });
  });

  describe('Update Profile', () => {
    it('should raise 401 Unauthorized error', async () => {
      const data = {
        name: 'New Name',
        password: 'wrong password',
      };

      const response: supertest.Response = await request
        .patch(`/v1/profile`)
        .set(auth(signInResponse.authorization))
        .send(data)
        .expect('Content-Type', /json/);

      validateStatus(response, 401);
      validateResponse(response, errorResponseSchema);
    });

    it('should set a new name', async () => {
      const data = {
        name: 'New Name',
        password: user1.password,
      };

      const response: supertest.Response = await request
        .patch(`/v1/profile`)
        .set(auth(signInResponse.authorization))
        .send(data)
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, updateProfileResponseSchema);

      const profile: IProfile = response.body.profile;

      profile.should.have.propertyByPath('name').equal(data.name);
    });
  });
});
