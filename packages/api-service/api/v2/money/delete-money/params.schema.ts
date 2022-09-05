import { OpenAPIV3_1 } from 'openapi-types';

import { moneyId } from '../../../../common/schemas/fields/money-id';

export const deleteMoneyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    moneyId,
  },
  additionalProperties: false,
  required: ['moneyId'],
};
