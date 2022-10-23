// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/accounts.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';

import { CreateAccountAPIData } from '../services/account/types';
import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createAccountResponseSchema } from '../api/v2/account/create-account/response.schema';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { getAccountResponseSchema } from '../api/v2/account/get-account/response.schema';
import { getAccountsResponseSchema } from '../api/v2/account/get-accounts/response.schema';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { updateAccountResponseSchema } from '../api/v2/account/update-account/response.schema';
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

describe('Accounts', function (): void {
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

  describe('Create account', () => {
    it('should create account', async () => {
      const data: CreateAccountAPIData = {
        accountTypeId: '1',
        name: 'Account name',
        isEnabled: true,
        note: 'Account note',
      };
      const response: supertest.Response = await request
        .post(`/v2/accounts`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createAccountResponseSchema);

      const account = response.body.account;
      expect(account).to.deep.include(data);
    });

    it('should not create account (validation fail)', async () => {
      const response: supertest.Response = await request
        .post(`/v2/accounts`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST);

      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Get accounts', () => {
    it('should gets account', async () => {
      const data: CreateAccountAPIData = {
        accountTypeId: '1',
        name: 'Account name',
      };

      const {
        body: { account },
      } = await request
        .post('/v2/accounts')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      const response: supertest.Response = await request
        .get(`/v2/accounts`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, getAccountsResponseSchema);
      expect(response.body.accounts).to.include.deep.members([account]);
    });
  });

  describe('Get account', () => {
    it('should get account', async () => {
      const data: CreateAccountAPIData = {
        accountTypeId: '1',
        name: 'Test account',
      };

      const {
        body: {
          account: { id: accountId },
        },
      } = await request
        .post('/v2/accounts')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const response = await request
        .get(`/v2/accounts/${accountId}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, getAccountResponseSchema);

      expect(response.body.account).to.be.deep.include({ ...data, id: accountId });
    });

    it('should raise "Account not found"', async () => {
      const response: supertest.Response = await request
        .get(`/v2/accounts/9999999`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);

      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Update account', () => {
    it('should update account', async () => {
      const data: CreateAccountAPIData = {
        accountTypeId: '1',
        name: 'Account name',
      };

      let response: supertest.Response = await request
        .post('/v2/accounts')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      const { id: accountId } = response.body.account;
      const name = 'New account name';

      response = await request
        .patch(`/v2/accounts/${accountId}`)
        .send({
          name,
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, updateAccountResponseSchema);

      const { account } = response.body;

      expect(account).to.be.deep.include({ ...data, id: accountId, name });
    });

    it('should not update not-existed account', async () => {
      const response: supertest.Response = await request
        .patch(`/v2/accounts/99999999`)
        .send({
          name: 'New name',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);

      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Delete account', () => {
    it('should delete account', async () => {
      const data: CreateAccountAPIData = {
        accountTypeId: '1',
        name: 'Account name',
      };

      let response: supertest.Response = await request
        .post('/v2/accounts')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      const { id: accountId } = response.body.account;

      await request
        .delete(`/v2/accounts/${accountId}`)
        .set(auth(signInResponse.authorization))
        .expect(StatusCodes.NO_CONTENT);
    });

    it('should not delete not-existed account', async () => {
      const response: supertest.Response = await request
        .delete(`/v2/accounts/999999999`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);

      validateResponse(response, errorResponseSchema);
    });
  });
});
