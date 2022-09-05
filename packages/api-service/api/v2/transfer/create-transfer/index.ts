import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createTransferParamsSchema } from './params.schema';
import { createTransferResponseSchema } from './response.schema';

export const createTransfer: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/transfers',
  handler,
  schemas: {
    params: createTransferParamsSchema,
    response: createTransferResponseSchema,
  },
};
