import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getDynamicsReportParamsSchema } from './params.schema';
import { getDynamicsReportResponseSchema } from './response.schema';

export const getDynamicsReport: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/reports/dynamics',
  handler,
  schemas: {
    params: getDynamicsReportParamsSchema,
    response: getDynamicsReportResponseSchema,
  },
};
