import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateMoneyParamsSchema } from './params.schema';
import { updateMoneyResponseSchema } from './response.schema';

export const updateMoney: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/moneys/:idMoney',
  handler,
  schemas: {
    params: updateMoneyParamsSchema,
    response: updateMoneyResponseSchema,
  },
};
