// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/plan-transactions.spec.ts

import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { expect } from 'chai';

import {
  CreatePlanTransactionAPIData,
  IPlanTransactionDTO,
  UpdatePlanTransactionServiceChanges,
} from '../modules/plan-transaction/types';
import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { RepetitionType, TerminationType } from '../modules/plan/types';
import { addYears, format } from 'date-fns';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createPlanTransactionResponseSchema } from '../api/v2/plan-transaction/create-plan-transaction/response.schema';
import { createRequestContext } from './libs/create-request-context';
import { deleteUser } from './libs/delete-user';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { updatePlanTransactionResponseSchema } from '../api/v2/plan-transaction/update-plan-transaction/response.schema';
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

describe('PlanTransaction', function (): void {
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
    await authorize(ctx, `Bearer ${signInResponse.authorization}`, '');
  });

  afterEach(async () => {
    await deleteUser(ctx, username);
  });

  describe('Create plan-transaction', () => {
    it('should create plan-transaction with no repetition', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: 0,
      };

      const response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createPlanTransactionResponseSchema);

      const planTransaction: IPlanTransactionDTO = response.body.planTransaction;
      expect(planTransaction).to.deep.include(data);
      expect(planTransaction).to.deep.include({
        repetitionDays: null,
        terminationType: null,
        repetitionCount: null,
        endDate: null,
      });
    });

    it('should create plan-transaction with weekly repetition & never stop', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: RepetitionType.Daily,
        repetitionDays: [1],
        terminationType: TerminationType.Never,
      };

      const response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createPlanTransactionResponseSchema);

      const planTransaction: IPlanTransactionDTO = response.body.planTransaction;
      expect(planTransaction).to.deep.include(data);
      expect(planTransaction).to.deep.include({
        repetitionCount: null,
        endDate: null,
      });
    });

    it('should create plan-transaction with monthly repetition & stop after 2 repetitions', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: RepetitionType.Monthly,
        repetitionDays: [15],
        terminationType: TerminationType.After,
        repetitionCount: 2,
      };

      const response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createPlanTransactionResponseSchema);

      const planTransaction: IPlanTransactionDTO = response.body.planTransaction;
      expect(planTransaction).to.deep.include(data);
      expect(planTransaction).to.deep.include({
        endDate: null,
      });
    });

    it('should create plan-transaction with annually repetition & stop after date', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: RepetitionType.Annually,
        terminationType: TerminationType.EndDate,
        endDate: format(addYears(new Date(), 3), 'yyyy-MM-dd'),
      };

      const response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createPlanTransactionResponseSchema);

      const planTransaction: IPlanTransactionDTO = response.body.planTransaction;
      expect(planTransaction).to.deep.include(data);
      expect(planTransaction).to.deep.include({
        repetitionCount: null,
      });
    });
  });

  describe('Update plan-transaction', () => {
    it('should update plan-transaction', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: 0,
      };

      let response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const { planId } = response.body.planTransaction;

      const changes: UpdatePlanTransactionServiceChanges = {
        amount: 200,
        repetitionType: 1,
        repetitionDays: [3],
        terminationType: 0,
      };

      response = await request
        .patch(`/v2/plan-transactions/${planId}`)
        .send(changes)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, updatePlanTransactionResponseSchema);

      const planTransaction: IPlanTransactionDTO = response.body.planTransaction;
      expect(planTransaction).to.deep.include(changes);
    });
  });

  describe('Delete plan-transaction', () => {
    it('should delete plan-transaction', async () => {
      const { accounts, categories, moneys } = userData;
      const data: CreatePlanTransactionAPIData = {
        sign: -1,
        amount: 100,
        moneyId: moneys[0].id,
        categoryId: String(categories[0].idCategory),
        accountId: String(accounts[0].idAccount),
        startDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        repetitionType: 0,
      };

      const response: supertest.Response = await request
        .post(`/v2/plan-transactions`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK);

      validateResponse(response, createPlanTransactionResponseSchema);

      const { planId }: IPlanTransactionDTO = response.body.planTransaction;

      await request
        .delete(`/v2/plan-transactions/${planId}`)
        .set(auth(signInResponse.authorization))
        .expect(StatusCodes.NO_CONTENT);

      await request
        .get(`/v2/plan-transactions/${planId}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND);
    });
  });
});
