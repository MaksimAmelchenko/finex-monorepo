import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateUnitParamsSchema } from './params.schema';
import { updateUnitResponseSchema } from './response.schema';

export const updateUnit: RestRouteOptions = {
  method: RestMethod.Patch,
  uri: '/v2/units/:unitId',
  handler,
  schemas: {
    params: updateUnitParamsSchema,
    response: updateUnitResponseSchema,
  },
};
