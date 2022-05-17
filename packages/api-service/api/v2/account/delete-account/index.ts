import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteAccountParamsSchema } from './params.schema';

export const deleteAccount: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/accounts/:accountId',
  handler,
  schemas: {
    params: deleteAccountParamsSchema,
  },
};
