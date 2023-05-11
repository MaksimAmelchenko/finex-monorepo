import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getInstitutionsParamsSchema } from './params.schema';
import { getInstitutionsResponseSchema } from './response.schema';

export const getInstitutions: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/connections/institutions',
  handler,
  schemas: {
    params: getInstitutionsParamsSchema,
    response: getInstitutionsResponseSchema,
  },
};
