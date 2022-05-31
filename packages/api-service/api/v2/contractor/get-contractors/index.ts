import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getContractorsParamsSchema } from './params.schema';
import { getContractorsResponseSchema } from './response.schema';

export const getContractors: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/contractors',
  handler,
  schemas: {
    params: getContractorsParamsSchema,
    response: getContractorsResponseSchema,
  },
};
