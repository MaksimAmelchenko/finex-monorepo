import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getUnitsParamsSchema } from './params.schema';
import { getUnitsResponseSchema } from './response.schema';

export const getUnits: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/units',
  handler,
  schemas: {
    params: getUnitsParamsSchema,
    response: getUnitsResponseSchema,
  },
};
