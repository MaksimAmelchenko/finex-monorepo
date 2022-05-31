import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteContractorParamsSchema } from './params.schema';

export const deleteCategory: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/contractors/:contractorId',
  handler,
  schemas: {
    params: deleteContractorParamsSchema,
  },
};
