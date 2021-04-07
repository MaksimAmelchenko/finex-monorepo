import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getAccountsParamsSchema } from './params.schema';
import { getAccountsResponseSchema } from './response.schema';

export const getAccounts: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/accounts',
  handler,
  schemas: {
    params: getAccountsParamsSchema,
    response: getAccountsResponseSchema,
  },
};
