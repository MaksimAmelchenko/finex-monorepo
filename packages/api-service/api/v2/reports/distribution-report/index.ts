import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { getDistributionReportParamsSchema } from './params.schema';
import { getDistributionReportResponseSchema } from './response.schema';

export const getDistributionReport: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v2/reports/distribution',
  handler,
  schemas: {
    params: getDistributionReportParamsSchema,
    response: getDistributionReportResponseSchema,
  },
};
