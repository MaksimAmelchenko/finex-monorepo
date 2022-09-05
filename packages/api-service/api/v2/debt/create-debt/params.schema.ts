import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { createDebtItemParamsSchema } from '../create-debt-item.params.schema';

export const createDebtParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
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
      items: createDebtItemParamsSchema,
    },
  },
  additionalProperties: false,
  required: ['contractorId'],
};
