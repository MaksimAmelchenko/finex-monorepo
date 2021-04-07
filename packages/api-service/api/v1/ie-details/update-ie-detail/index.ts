import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateIeDetailResponseSchema } from './response.schema';
import { updateIeDetailParamsSchema } from './params.schema';

export const updateIeDetail: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/cashflows/ie_details/:idIEDetail',
  handler,
  schemas: {
    params: updateIeDetailParamsSchema,
    response: updateIeDetailResponseSchema,
  },
};
