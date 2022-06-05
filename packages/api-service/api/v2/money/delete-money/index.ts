import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteMoneyParamsSchema } from './params.schema';

export const deleteMoney: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/moneys/:moneyId',
  handler,
  schemas: {
    params: deleteMoneyParamsSchema,
  },
};
