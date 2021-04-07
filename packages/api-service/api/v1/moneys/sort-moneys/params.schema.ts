import { OpenAPIV3 } from 'openapi-types';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const sortMoneysParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    moneys: {
      type: 'array',
      items: moneyId,
    },
  },
  additionalProperties: false,
  required: ['moneys'],
};
