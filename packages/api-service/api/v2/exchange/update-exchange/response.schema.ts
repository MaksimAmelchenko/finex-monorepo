import { OpenAPIV3_1 } from 'openapi-types';

import { exchangeSchema } from '../exchange.schema';

export const updateExchangeResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    exchange: exchangeSchema,
  },
  additionalProperties: false,
  required: ['exchange'],
};
