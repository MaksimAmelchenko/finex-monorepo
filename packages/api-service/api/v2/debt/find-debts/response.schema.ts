import { OpenAPIV3 } from 'openapi-types';

import { debtSchema } from '../debt.schema';

export const findDebtsResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    debts: {
      type: 'array',
      items: debtSchema,
    },
    metadata: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
        },
        offset: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
      },
    },
  },
  additionalProperties: false,
  required: ['debts', 'metadata'],
};
