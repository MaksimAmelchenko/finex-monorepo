import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteAccountParamsSchema } from './params.schema';
import { deleteAccountResponseSchema } from './response.schema';

export const deleteAccount: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/accounts/:idAccount',
  handler,
  schemas: {
    params: deleteAccountParamsSchema,
    response: deleteAccountResponseSchema,
  },
};
