import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getAccountResponseSchema } from './response.schema';
import { getAccountParamsSchema } from './params.schema';

export const getAccount: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/accounts/:idAccount',
  handler,
  schemas: {
    params: getAccountParamsSchema,
    response: getAccountResponseSchema,
  },
};
