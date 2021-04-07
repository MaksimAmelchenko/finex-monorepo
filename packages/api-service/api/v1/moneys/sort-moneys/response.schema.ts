import { OpenAPIV3 } from 'openapi-types';
import { moneySchema } from '../../../../common/schemas/money.schema';

export const sortMoneysResponseSchema: OpenAPIV3.SchemaObject = {
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
