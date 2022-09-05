import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { findTransfersParamsSchema } from './params.schema';
import { findTransfersResponseSchema } from './response.schema';

export const findTransfers: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/transfers',
  handler,
  schemas: {
    params: findTransfersParamsSchema,
    response: findTransfersResponseSchema,
  },
};
