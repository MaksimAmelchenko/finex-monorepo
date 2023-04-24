import { OpenAPIV3_1 } from 'openapi-types';

export const currencySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      example: 'USD',
    },
    name: {
      type: 'string',
      example: 'United States Dollar',
    },
    precision: {
      type: 'number',
    },
    symbol: {
      type: 'string',
      example: '$',
    },
  },
  additionalProperties: false,
  required: ['code', 'name', 'precision', 'symbol'],
};
