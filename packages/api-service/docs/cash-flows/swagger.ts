import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { cashFlowSchema } from '../../api/v2/cash-flow/cash-flow.schema';
import { createCashFlowParamsSchema } from '../../api/v2/cash-flow/create-cash-flow/params.schema';
import { createCashFlowResponseSchema } from '../../api/v2/cash-flow/create-cash-flow/response.schema';
import { deleteCashFlowParamsSchema } from '../../api/v2/cash-flow/delete-cash-flow/params.schema';
import { findCashFlowsParamsSchema } from '../../api/v2/cash-flow/find-cash-flows/params.schema';
import { findCashFlowsResponseSchema } from '../../api/v2/cash-flow/find-cash-flows/response.schema';
import { updateCashFlowParamsSchema } from '../../api/v2/cash-flow/update-cash-flow/params.schema';
import { updateCashFlowResponseSchema } from '../../api/v2/cash-flow/update-cash-flow/response.schema';

const cashFlows: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'cash-flows',
      description: '',
    },
  ],
  paths: {
    '/cash-flows': {
      get: {
        tags: ['cash-flows'],
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
        tags: ['cash-flows'],
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
    '/cash-flows/{cashFlowId}': {
      patch: {
        tags: ['cash-flows'],
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
        tags: ['cash-flows'],
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
