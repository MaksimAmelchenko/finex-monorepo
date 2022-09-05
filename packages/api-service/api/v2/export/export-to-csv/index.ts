import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { exportToCsvParamsSchema } from './params.schema';
import { exportToCsvResponseSchema } from './response.schema';

export const exportToCsv: RestRouteOptions<never> = {
  method: RestMethod.Post,
  uri: '/v1/export-to-csv',
  handler,
  schemas: {
    params: exportToCsvParamsSchema,
    response: exportToCsvResponseSchema,
  },
};
