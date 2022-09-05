import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteTransferParamsSchema } from './params.schema';

export const deleteDebt: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/transfers/:transferId',
  handler,
  schemas: {
    params: deleteTransferParamsSchema,
  },
};
