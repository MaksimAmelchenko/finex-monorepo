import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createUnitParamsSchema } from './params.schema';
import { createUnitResponseSchema } from './response.schema';

export const createUnit: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/units',
  handler,
  schemas: {
    params: createUnitParamsSchema,
    response: createUnitResponseSchema,
  },
};
