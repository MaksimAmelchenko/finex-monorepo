import { OpenAPIV3_1 } from 'openapi-types';
import { moneySchema } from '../money.schema';

export const getMoneysResponseSchema: OpenAPIV3_1.SchemaObject = {
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
