// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/exchanges.spec.ts

import 'should';
import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { CreateExchangeServiceData, IExchangeDTO, UpdateExchangeServiceChanges } from '../modules/exchange/types';
import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createRequestContext } from './libs/create-request-context';
import { createExchangeResponseSchema } from '../api/v2/exchange/create-exchange/response.schema';
import { deleteUser } from './libs/delete-user';
import { format } from 'date-fns';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { updateExchangeResponseSchema } from '../api/v2/exchange/update-exchange/response.schema';
import { validateResponse } from './libs/validate-response';
import { validateStatus } from './libs/validate-status';

let server: Http.Server;
let request: supertest.SuperTest<supertest.Test>;

const username = 'test@finex.io';
const password = 'password';

let signInResponse: ISessionResponse;
let userData: UserData;
let projectId: string;
let userId: string;
let ctx: IRequestContext<never, true>;

describe('Exchanges', function (): void {
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

  describe('Create exchange', () => {
    it('should create exchange without fee', async () => {
      const { accounts, moneys } = userData;
      const data: CreateExchangeServiceData = {
        amountSell: 100,
        moneySellId: String(moneys[0].idMoney),
        amountBuy: 10,
        moneyBuyId: String(moneys[1].idMoney),
        accountSellId: String(accounts[0].idAccount),
        accountBuyId: String(accounts[1].idAccount),
        exchangeDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      const response: supertest.Response = await request
        .post(`/v2/exchanges`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, createExchangeResponseSchema);

      const exchange: IExchangeDTO = response.body.exchange;
      exchange.should.containDeep(data);
    });

    it('should create exchange with fee', async () => {
      const { accounts, moneys } = userData;
      const data: CreateExchangeServiceData = {
        amountSell: 100,
        moneySellId: String(moneys[0].idMoney),
        amountBuy: 10,
        moneyBuyId: String(moneys[1].idMoney),
        accountSellId: String(accounts[0].idAccount),
        accountBuyId: String(accounts[1].idAccount),
        exchangeDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        fee: 10,
        moneyFeeId: String(moneys[0].idMoney),
        accountFeeId: String(accounts[0].idAccount),
      };

      const response: supertest.Response = await request
        .post(`/v2/exchanges`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, createExchangeResponseSchema);

      const exchange: IExchangeDTO = response.body.exchange;
      exchange.should.containDeep(data);
    });
  });

  describe('Update exchange', () => {
    it('should update exchange', async () => {
      const { accounts, moneys } = userData;

      const data: CreateExchangeServiceData = {
        amountSell: 100,
        moneySellId: String(moneys[0].idMoney),
        amountBuy: 10,
        moneyBuyId: String(moneys[1].idMoney),
        accountSellId: String(accounts[0].idAccount),
        accountBuyId: String(accounts[1].idAccount),
        exchangeDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      let response: supertest.Response = await request
        .post('/v2/exchanges')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const { id: exchangeId } = response.body.exchange;

      const changes: UpdateExchangeServiceChanges = {
        amountSell: 50,
        accountSellId: String(accounts[1].idAccount),
        fee: 10,
        moneyFeeId: String(moneys[0].idMoney),
        accountFeeId: String(accounts[0].idAccount),
      };

      response = await request
        .patch(`/v2/exchanges/${exchangeId}`)
        .send(changes)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, updateExchangeResponseSchema);

      const exchange: IExchangeDTO = response.body.exchange;
      exchange.should.containDeep(changes);
    });
  });

  describe('Delete exchange', () => {
    it('should delete exchange', async () => {
      const { accounts, moneys } = userData;
      const data: CreateExchangeServiceData = {
        amountSell: 100,
        moneySellId: String(moneys[0].idMoney),
        amountBuy: 10,
        moneyBuyId: String(moneys[1].idMoney),
        accountSellId: String(accounts[0].idAccount),
        accountBuyId: String(accounts[1].idAccount),
        exchangeDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      let response: supertest.Response = await request
        .post('/v2/exchanges')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const exchange: IExchangeDTO = response.body.exchange;

      response = await request.delete(`/v2/exchanges/${exchange.id}`).set(auth(signInResponse.authorization));
      validateStatus(response, StatusCodes.NO_CONTENT);

      response = await request
        .get(`/v2/exchanges/${exchange.id}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, StatusCodes.NOT_FOUND);
    });
  });
});
