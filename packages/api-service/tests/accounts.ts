// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/profile.ts

import 'should';
import * as supertest from 'supertest';
import * as Http from 'http';

import config from '../libs/config';

import { app } from '../server';
import { ISessionResponse } from '../types/auth';
import { signIn } from './libs/sign-in';
import { validateStatus } from './libs/validate-status';
import { validateResponse } from './libs/validate-response';

import { auth } from './libs/auth';
import { errorResponseSchema } from '../common/schemas/error.response.schema';
import { createAccountResponseSchema } from '../api/v1/accounts/create-account/response.schema';
import { getAccountsResponseSchema } from '../api/v1/accounts/get-accounts/response.schema';
import { getAccountResponseSchema } from '../api/v1/accounts/get-account/response.schema';
import { updateAccountResponseSchema } from '../api/v1/accounts/update-account/response.schema';
import { deleteAccountResponseSchema } from '../api/v1/accounts/delete-account/response.schema';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const [testAccount] = config.get('testAccounts');

const { user1 } = testAccount.users;

let signInResponse: ISessionResponse;

describe('Accounts', function (): void {
  this.timeout(30000);

  before(async () => {
    server = app.listen();
    request = supertest(server);

    signInResponse = <ISessionResponse>await signIn(request, user1.username, user1.password);
  });

  after(async () => {
    try {
    } finally {
      server.close();
    }
  });

  describe('Create account', () => {
    it('should create account', async () => {
      const response: supertest.Response = await request
        .post(`/v1/accounts`)
        .send({
          idAccountType: 1,
          name: `Test account ${new Date().getTime()}`,
          isEnabled: true,
          note: 'test account',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, createAccountResponseSchema);
    });

    it('should not create account (validation fail)', async () => {
      const response: supertest.Response = await request
        .post(`/v1/accounts`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 400);
      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Get accounts', () => {
    it('should gets account', async () => {
      await request
        .post(`/v1/accounts`)
        .send({
          idAccountType: 1,
          name: `Test account ${new Date().getTime()}`,
          isEnabled: true,
          note: 'test account',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const response: supertest.Response = await request
        .get(`/v1/accounts`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(200);

      validateResponse(response, getAccountsResponseSchema);

      response.body.accounts.length.should.be.greaterThan(1);
    });
  });

  describe('Get account', () => {
    it('should get account', async () => {
      const {
        body: { account },
      } = await request
        .post(`/v1/accounts`)
        .send({
          idAccountType: 1,
          name: `Test account ${new Date().getTime()}`,
          isEnabled: true,
          note: 'test account',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const response: supertest.Response = await request
        .get(`/v1/accounts/${account.idAccount}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, getAccountResponseSchema);

      response.body.account.idAccount.should.be.equal(account.idAccount);
    });

    it('should raise "Account not found"', async () => {
      const response: supertest.Response = await request
        .get(`/v1/accounts/9999999`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 404);
      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Update account', () => {
    it('should update account', async () => {
      const {
        body: { account },
      } = await request
        .post(`/v1/accounts`)
        .send({
          idAccountType: 1,
          name: `Test account ${new Date().getTime()}`,
          isEnabled: true,
          note: 'test account',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const name = `New account name ${new Date().getTime()}`;
      const response: supertest.Response = await request
        .patch(`/v1/accounts/${account.idAccount}`)
        .send({
          name,
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, updateAccountResponseSchema);

      response.body.account.idAccount.should.be.equal(account.idAccount);
      response.body.account.name.should.be.equal(name);
    });

    it('should not update not-existed account', async () => {
      const response: supertest.Response = await request
        .patch(`/v1/accounts/99999999`)
        .send({
          name: 'New name',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 404);
      validateResponse(response, errorResponseSchema);
    });
  });

  describe('Delete account', () => {
    it('should delete account', async () => {
      const {
        body: { account },
      } = await request
        .post(`/v1/accounts`)
        .send({
          idAccountType: 1,
          name: `Test account ${new Date().getTime()}`,
          isEnabled: true,
          note: 'test account',
        })
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const response: supertest.Response = await request
        .delete(`/v1/accounts/${account.idAccount}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, deleteAccountResponseSchema);

      await request
        .get(`/v1/accounts/${account.idAccount}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should not delete not-existed account', async () => {
      const response: supertest.Response = await request
        .delete(`/v1/accounts/999999999`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(404);

      validateResponse(response, errorResponseSchema);
    });
  });
});
