import { OpenAPIV3_1 } from 'openapi-types';

import { exchangeSchema } from '../exchange.schema';

export const findExchangesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    exchanges: {
      type: 'array',
      items: exchangeSchema,
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
  required: ['exchanges', 'metadata'],
};
