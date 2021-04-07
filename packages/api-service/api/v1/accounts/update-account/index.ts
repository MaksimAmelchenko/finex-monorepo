import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateAccountResponseSchema } from './response.schema';
import { updateAccountParamsSchema } from './params.schema';

export const updateAccount: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/accounts/:idAccount',
  handler,
  schemas: {
    params: updateAccountParamsSchema,
    response: updateAccountResponseSchema,
  },
};
