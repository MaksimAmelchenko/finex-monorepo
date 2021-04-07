import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

// import paramsSchema from './params.schema';
// import responseSchema from './response.schema';

export const getUser: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/users/:idUser',
  handler,
  schemas: {
    // params: paramsSchema,
    // response: responseSchema,
  },
};
