import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { idMoney } from '../../../../common/schemas/fields/id-money';

export const updateMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idMoney,
    idCurrency: {
      ...id,
      nullable: true,
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
