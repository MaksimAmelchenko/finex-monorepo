import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

// import paramsSchema from './params.schema';
// import responseSchema from './response.schema';

export const getIes: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/ies',
  handler,
  schemas: {
    // params: paramsSchema,
    // response: responseSchema,
  },
};
