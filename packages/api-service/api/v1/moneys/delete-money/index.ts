import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteMoneyParamsSchema } from './params.schema';
import { deleteMoneyResponseSchema } from './response.schema';

export const deleteMoney: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/moneys/:idMoney',
  handler,
  schemas: {
    params: deleteMoneyParamsSchema,
    response: deleteMoneyResponseSchema,
  },
};
