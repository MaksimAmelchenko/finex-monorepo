import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createContractorParamsSchema } from './params.schema';
import { createContractorResponseSchema } from './response.schema';

export const createContractor: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/contractors',
  handler,
  schemas: {
    params: createContractorParamsSchema,
    response: createContractorResponseSchema,
  },
};
