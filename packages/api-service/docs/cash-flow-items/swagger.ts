import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { cashFlowItemSchema } from '../../api/v2/cash-flow/cash-flow-item.schema';
import { createCashFlowItemParamsSchema } from '../../api/v2/cash-flow-item/create-cash-flow-item/params.schema';
import { createCashFlowItemResponseSchema } from '../../api/v2/cash-flow-item/create-cash-flow-item/response.schema';
import { deleteCashFlowItemParamsSchema } from '../../api/v2/cash-flow-item/delete-cash-flow-item/params.schema';
import { updateCashFlowItemParamsSchema } from '../../api/v2/cash-flow-item/update-cash-flow-item/params.schema';
import { updateCashFlowItemResponseSchema } from '../../api/v2/cash-flow-item/update-cash-flow-item/response.schema';

const cashFlowItems: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'cash-flow-items',
      description: '',
    },
  ],
  paths: {
    '/cash-flows/{cashFlowId}/items': {
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
    '/cash-flows/{cashFlowId}/items/{cashFlowItemId}': {
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
