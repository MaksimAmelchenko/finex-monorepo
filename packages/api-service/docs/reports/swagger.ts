import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { getDistributionReportParamsSchema } from '../../api/v2/reports/distribution-report/params.schema';
import { getDistributionReportResponseSchema } from '../../api/v2/reports/distribution-report/response.schema';
import { getDynamicsReportParamsSchema } from '../../api/v2/reports/dynamics-report/params.schema';
import { getDynamicsReportResponseSchema } from '../../api/v2/reports/dynamics-report/response.schema';

const reports: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'accounts',
      description: '',
    },
  ],
  paths: {
    '/reports/dynamics': {
      get: {
        tags: ['reports'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getDynamicsReportParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getDynamicsReportResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/reports/distribution': {
      get: {
        tags: ['reports'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getDistributionReportParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getDistributionReportResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
  },
  components: {
    schemas: {},
    parameters: {},
  },
};

export { reports };
export default reports;
