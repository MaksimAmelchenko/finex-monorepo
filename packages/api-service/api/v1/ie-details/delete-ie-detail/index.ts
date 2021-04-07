import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { deleteIeDetailParamsSchema } from './params.schema';
import { deleteIeDetailResponseSchema } from './response.schema';

export const deleteIeDetail: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/cashflows/ie_details/:idIEDetail',
  handler,
  schemas: {
    params: deleteIeDetailParamsSchema,
    response: deleteIeDetailResponseSchema,
  },
};
