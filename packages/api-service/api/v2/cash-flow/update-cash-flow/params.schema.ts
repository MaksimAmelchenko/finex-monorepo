import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { id } from '../../../../common/schemas/fields/id';
import { updateCashFlowItemParamsSchema } from './update-cash-flow-item.params.schema';

export const updateCashFlowParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
    contractorId,
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    items: {
      type: 'array',
      items: {
        oneOf: [
          //
          // createCashFlowItemParamsSchema,
          updateCashFlowItemParamsSchema,
          // deleteCashFlowItemParamsSchema,
        ],
      },
    },
  },
  additionalProperties: false,
  required: ['cashFlowId'],
};
