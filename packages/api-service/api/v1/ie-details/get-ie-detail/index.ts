import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { getIeDetailParamsSchema } from './params.schema';
import { getIeDetailResponseSchema } from './response.schema';

export const getIeDetail: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/ie_details/:idIEDetail',
  handler,
  schemas: {
    params: getIeDetailParamsSchema,
    response: getIeDetailResponseSchema,
  },
};
