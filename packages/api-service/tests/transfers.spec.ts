// NODE_ENV=development-test-local ./node_modules/.bin/mocha --require ts-node/register --exit ./tests/transfers.spec.ts

import 'should';
import * as Http from 'http';
import * as supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { CreateTransferServiceData, ITransferDTO, UpdateTransferServiceChanges } from '../modules/transfer/types';
import { IRequestContext } from '../types/app';
import { ISessionResponse } from '../types/auth';
import { app } from '../server';
import { auth } from './libs/auth';
import { authorize } from '../libs/rest-api/authorize';
import { createRequestContext } from './libs/create-request-context';
import { createTransferResponseSchema } from '../api/v2/transfer/create-transfer/response.schema';
import { deleteUser } from './libs/delete-user';
import { format } from 'date-fns';
import { initUser, UserData } from './libs/init-user';
import { signIn } from './libs/sign-in';
import { updateTransferResponseSchema } from '../api/v2/transfer/update-transfer/response.schema';
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

describe('Transfers', function (): void {
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

  describe('Create transfer', () => {
    it('should create transfer without fee', async () => {
      const { accounts, moneys } = userData;
      const data: CreateTransferServiceData = {
        amount: 100,
        moneyId: String(moneys[0].idMoney),
        accountFromId: String(accounts[0].idAccount),
        accountToId: String(accounts[1].idAccount),
        transferDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      const response: supertest.Response = await request
        .post(`/v2/transfers`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, createTransferResponseSchema);

      const transfer: ITransferDTO = response.body.transfer;
      transfer.should.containDeep(data);
    });

    it('should create transfer with fee', async () => {
      const { accounts, moneys } = userData;
      const data: CreateTransferServiceData = {
        amount: 100,
        moneyId: String(moneys[0].idMoney),
        accountFromId: String(accounts[0].idAccount),
        accountToId: String(accounts[1].idAccount),
        transferDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
        fee: 10,
        moneyFeeId: String(moneys[0].idMoney),
        accountFeeId: String(accounts[0].idAccount),
      };

      const response: supertest.Response = await request
        .post(`/v2/transfers`)
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, createTransferResponseSchema);

      const transfer: ITransferDTO = response.body.transfer;
      transfer.should.containDeep(data);
    });
  });

  describe('Update transfer', () => {
    it('should update transfer', async () => {
      const { accounts, moneys } = userData;

      const data: CreateTransferServiceData = {
        amount: 100,
        moneyId: String(moneys[0].idMoney),
        accountFromId: String(accounts[0].idAccount),
        accountToId: String(accounts[1].idAccount),
        transferDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      let response: supertest.Response = await request
        .post('/v2/transfers')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const { id: transferId } = response.body.transfer;

      const changes: UpdateTransferServiceChanges = {
        amount: 50,
        moneyId: String(moneys[0].idMoney),
        fee: 10,
        moneyFeeId: String(moneys[0].idMoney),
        accountFeeId: String(accounts[0].idAccount),
      };

      response = await request
        .patch(`/v2/transfers/${transferId}`)
        .send(changes)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, 200);
      validateResponse(response, updateTransferResponseSchema);

      const transfer: ITransferDTO = response.body.transfer;
      transfer.should.containDeep(changes);
    });
  });

  describe('Delete transfer', () => {
    it('should delete transfer', async () => {
      const { accounts, moneys } = userData;
      const data: CreateTransferServiceData = {
        amount: 100,
        moneyId: String(moneys[0].idMoney),
        accountFromId: String(accounts[0].idAccount),
        accountToId: String(accounts[1].idAccount),
        transferDate: format(new Date(), 'yyyy-MM-dd'),
        reportPeriod: format(new Date(), 'yyyy-MM-01'),
      };

      let response: supertest.Response = await request
        .post('/v2/transfers')
        .send(data)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      const transfer: ITransferDTO = response.body.transfer;

      response = await request.delete(`/v2/transfers/${transfer.id}`).set(auth(signInResponse.authorization));
      validateStatus(response, StatusCodes.NO_CONTENT);

      response = await request
        .get(`/v2/transfers/${transfer.id}`)
        .set(auth(signInResponse.authorization))
        .expect('Content-Type', /json/);

      validateStatus(response, StatusCodes.NOT_FOUND);
    });
  });
});
