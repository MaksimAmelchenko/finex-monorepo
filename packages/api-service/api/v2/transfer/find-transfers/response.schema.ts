import { OpenAPIV3_1 } from 'openapi-types';

import { transferSchema } from '../transfer.schema';

export const findTransfersResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transfers: {
      type: 'array',
      items: transferSchema,
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
  required: ['transfers', 'metadata'],
};
