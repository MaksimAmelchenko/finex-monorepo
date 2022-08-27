import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createDebtParamsSchema } from './params.schema';
import { createDebtResponseSchema } from './response.schema';

export const createDebt: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/debts',
  handler,
  schemas: {
    params: createDebtParamsSchema,
    response: createDebtResponseSchema,
  },
};
