import { OpenAPIV3 } from 'openapi-types';
import { moneySchema } from '../money.schema';

export const getMoneysResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    moneys: {
      type: 'array',
      items: moneySchema,
    },
  },
  additionalProperties: false,
  required: ['moneys'],
};
