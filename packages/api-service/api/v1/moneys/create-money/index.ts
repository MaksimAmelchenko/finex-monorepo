import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createMoneyParamsSchema } from './params.schema';
import { createMoneyResponseSchema } from './response.schema';

export const createMoney: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/moneys',
  handler,
  schemas: {
    params: createMoneyParamsSchema,
    response: createMoneyResponseSchema,
  },
};
