import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getMoneyParamsSchema } from './params.schema';
import { getMoneyResponseSchema } from './response.schema';

export const getMoney: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/moneys/:idMoney',
  handler,
  schemas: {
    params: getMoneyParamsSchema,
    response: getMoneyResponseSchema,
  },
};
