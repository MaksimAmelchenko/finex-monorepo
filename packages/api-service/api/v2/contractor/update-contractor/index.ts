import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateContractorParamsSchema } from './params.schema';
import { updateContractorResponseSchema } from './response.schema';

export const updateContractor: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/contractors/:contractorId',
  handler,
  schemas: {
    params: updateContractorParamsSchema,
    response: updateContractorResponseSchema,
  },
};
