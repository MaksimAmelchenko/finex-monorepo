import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { completeRequisitionParamsSchema } from './params.schema';
import { completeRequisitionResponseSchema } from './response.schema';

export const completeRequisition: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/connections/nordigen/requisitions/:requisitionId/complete',
  handler,
  schemas: {
    params: completeRequisitionParamsSchema,
    response: completeRequisitionResponseSchema,
  },
};
