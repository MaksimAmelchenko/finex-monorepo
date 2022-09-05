import { OpenAPIV3_1 } from 'openapi-types';

import { idUser } from './fields/id-user';
import { idMoney } from './fields/id-money';

export const moneySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idMoney,
    idCurrency: {
      type: ['integer', 'null'],
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: ['integer', 'null'],
    },
    precision: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idUser',
    'idMoney',
    'idCurrency',
    'name',
    'symbol',
    'isEnabled',
    'sorting',
    'precision',
  ],
};
