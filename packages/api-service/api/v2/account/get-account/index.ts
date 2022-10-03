import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getAccountParamsSchema } from './params.schema';
import { getAccountResponseSchema } from './response.schema';

export const getAccount: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/accounts/:accountId',
  handler,
  schemas: {
    params: getAccountParamsSchema,
    response: getAccountResponseSchema,
  },
};
