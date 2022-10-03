// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/profile.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';

import { IProfile } from '../types/profile';
import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { getProfileResponseSchema } from '../api/v1/profile/get-profile/response.schema';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { updateProfileResponseSchema } from '../api/v1/profile/update-profile/response.schema';
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

describe('Profile', function (): void {
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

  describe('Get Profile', () => {
    it('should get profile', async () => {
      const response: supertest.Response = await request
        .get(`/v1/profile`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, getProfileResponseSchema);
    });
  });

  describe('Update Profile', () => {
    it('should raise 401 Unauthorized error', async () => {
      const data = {
        name: 'New name',
        password: 'wrong password',
      };

      const response: supertest.Response = await request
        .patch(`/v1/profile/${userId}`)
        .set(auth(signInResponse.authorization))
        .send(data)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.UNAUTHORIZED);

      validateResponse(response, errorResponseSchema);
    });

    it('should set a new name', async () => {
      const data = {
        name: 'New name',
        password,
      };

      const response: supertest.Response = await request
        .patch(`/v1/profile/${userId}`)
        .set(auth(signInResponse.authorization))
        .send(data)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, updateProfileResponseSchema);

      const profile: IProfile = response.body.profile;

      expect(profile).to.have.property('name').equal(data.name);
    });
  });
});
