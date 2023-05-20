import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getCountriesParamsSchema } from './params.schema';
import { getCountriesResponseSchema } from './response.schema';

export const getCountries: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/connections/countries',
  handler,
  schemas: {
    params: getCountriesParamsSchema,
    response: getCountriesResponseSchema,
  },
};
