import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { cashFlowSchema } from '../../api/v2/cashflow/cashflow.schema';
import { createCashFlowParamsSchema } from '../../api/v2/cashflow/create-cashflow/params.schema';
import { createCashFlowResponseSchema } from '../../api/v2/cashflow/create-cashflow/response.schema';
import { deleteCashFlowParamsSchema } from '../../api/v2/cashflow/delete-cashflow/params.schema';
import { findCashFlowsParamsSchema } from '../../api/v2/cashflow/find-cashflows/params.schema';
import { findCashFlowsResponseSchema } from '../../api/v2/cashflow/find-cashflows/response.schema';
import { updateCashFlowParamsSchema } from '../../api/v2/cashflow/update-cashflow/params.schema';
import { updateCashFlowResponseSchema } from '../../api/v2/cashflow/update-cashflow/response.schema';

const cashFlows: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'cashFlows',
      description: '',
    },
  ],
  paths: {
    '/cashflows': {
      get: {
        tags: ['cashFlows'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: findCashFlowsParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: findCashFlowsResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['cashFlows'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createCashFlowParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createCashFlowResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/cashflows/{cashFlowId}': {
      patch: {
        tags: ['cashFlows'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateCashFlowParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateCashFlowResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['cashFlows'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteCashFlowParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          204: {
            description: 'Successful operation',
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
  },
  components: {
    schemas: {
      CashFlow: cashFlowSchema,
    },
    parameters: {},
  },
};

export { cashFlows };
export default cashFlows;
