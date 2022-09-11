import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteExchangeParamsSchema } from './params.schema';

export const deleteDebt: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/exchanges/:exchangeId',
  handler,
  schemas: {
    params: deleteExchangeParamsSchema,
  },
};
