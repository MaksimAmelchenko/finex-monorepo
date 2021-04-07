import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

// import paramsSchema from './params.schema';
// import responseSchema from './response.schema';

export const updateIePlan: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/plans/cashflow_items/:idPlanCashFlowItem',
  handler,
  schemas: {
    // params: paramsSchema,
    // response: responseSchema,
  },
};
