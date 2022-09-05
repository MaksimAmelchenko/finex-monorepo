import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getTransferParamsSchema } from './params.schema';
import { getTransferResponseSchema } from './response.schema';

export const getTransfer: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/transfers/:transferId',
  handler,
  schemas: {
    params: getTransferParamsSchema,
    response: getTransferResponseSchema,
  },
};
