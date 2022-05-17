import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createAccountParamsSchema } from './params.schema';
import { createAccountResponseSchema } from './response.schema';

export const createAccount: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/accounts',
  handler,
  schemas: {
    params: createAccountParamsSchema,
    response: createAccountResponseSchema,
  },
};
