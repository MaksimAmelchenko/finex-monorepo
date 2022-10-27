import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { cashFlowItemSchema } from '../../api/v2/cashflow/cashflow-item.schema';
import { createCashFlowItemParamsSchema } from '../../api/v2/cashflow-item/create-cashflow-item/params.schema';
import { createCashFlowItemResponseSchema } from '../../api/v2/cashflow-item/create-cashflow-item/response.schema';
import { deleteCashFlowItemParamsSchema } from '../../api/v2/cashflow-item/delete-cashflow-item/params.schema';
import { updateCashFlowItemParamsSchema } from '../../api/v2/cashflow-item/update-cashflow-item/params.schema';
import { updateCashFlowItemResponseSchema } from '../../api/v2/cashflow-item/update-cashflow-item/response.schema';

const cashFlowItems: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'cash-flow-items',
      description: '',
    },
  ],
  paths: {
    '/cashflows/{cashFlowId}/items': {
      post: {
        tags: ['cash-flow-items'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createCashFlowItemParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createCashFlowItemResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/cashflows/{cashFlowId}/items/{cashFlowItemId}': {
      patch: {
        tags: ['cash-flow-items'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateCashFlowItemParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateCashFlowItemResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['cash-flow-items'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteCashFlowItemParamsSchema,
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
      cashFlowItem: cashFlowItemSchema,
    },
    parameters: {},
  },
};

export { cashFlowItems };
export default cashFlowItems;
