import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteUnitParamsSchema } from './params.schema';

export const deleteUnit: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v2/units/:unitId',
  handler,
  schemas: {
    params: deleteUnitParamsSchema,
  },
};
