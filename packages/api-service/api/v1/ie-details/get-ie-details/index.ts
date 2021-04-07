import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getIeDetailsParamsSchema } from './params.schema';
import { getIeDetailsResponseSchema } from './response.schema';

export const getIeDetails: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/ie_details',
  handler,
  schemas: {
    params: getIeDetailsParamsSchema,
    response: getIeDetailsResponseSchema,
  },
};
