import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { idMoney } from '../../../../common/schemas/fields/id-money';

export const updateMoneyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idMoney,
    idCurrency: {
      ...id,
      type: ['integer', 'null'],
    },
    isEnabled: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    precision: {
      type: 'integer',
    },
    symbol: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idMoney'],
};
