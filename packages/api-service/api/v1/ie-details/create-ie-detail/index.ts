import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { createIeDetailParamsSchema } from './params.schema';
import { createIeDetailResponseSchema } from './response.schema';

export const createIeDetail: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/cashflows/ie_details',
  handler,
  schemas: {
    params: createIeDetailParamsSchema,
    response: createIeDetailResponseSchema,
  },
};
