import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateMoneyParamsSchema } from './params.schema';
import { updateMoneyResponseSchema } from './response.schema';

export const updateMoney: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/moneys/:moneyId',
  handler,
  schemas: {
    params: updateMoneyParamsSchema,
    response: updateMoneyResponseSchema,
  },
};
