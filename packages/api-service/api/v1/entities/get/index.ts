import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getEntitiesParamsSchema } from './params.schema';
import { getEntitiesResponseSchema } from './response.schema';

export const getEntities: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/entities',
  handler,
  schemas: {
    params: getEntitiesParamsSchema,
    response: getEntitiesResponseSchema,
  },
  isNeedAuthorization: true,
};
