import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { onEnter } from './on-enter';

import { createRequisitionParamsSchema } from './params.schema';
import { createRequisitionResponseSchema } from './response.schema';

export const createRequisition: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/connections/nordigen/requisitions',
  handler,
  schemas: {
    params: createRequisitionParamsSchema,
    response: createRequisitionResponseSchema,
  },
  onEnter,
};
