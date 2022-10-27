import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { createCashFlowItemParamsSchema } from '../create-cash-flow-item.params.schema';

export const createCashFlowParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractorId: {
      ...contractorId,
      type: ['string', 'null'],
    },
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
      items: createCashFlowItemParamsSchema,
    },
  },
  additionalProperties: false,
};
