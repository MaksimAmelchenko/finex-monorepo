import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateTransferParamsSchema } from './params.schema';
import { updateTransferResponseSchema } from './response.schema';

export const updateTransfer: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/transfers/:transferId',
  handler,
  schemas: {
    params: updateTransferParamsSchema,
    response: updateTransferResponseSchema,
  },
};
