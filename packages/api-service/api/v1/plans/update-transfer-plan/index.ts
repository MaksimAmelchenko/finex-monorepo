import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

// import paramsSchema from './params.schema';
// import responseSchema from './response.schema';

export const updateTransferPlan: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/plans/transfers/:idPlanTransfer',
  handler,
  schemas: {
    // params: paramsSchema,
    // response: responseSchema,
  },
};
