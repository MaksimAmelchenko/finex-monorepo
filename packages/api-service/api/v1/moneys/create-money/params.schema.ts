import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const createMoneyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCurrency: {
      ...id,
      type: ['integer', 'null'],
    },
    isEnabled: {
      type: ['boolean', 'null'],
      default: true,
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
    // frontend sends these fields
    idUser: {
      type: ['integer', 'null'],
    },
    idMoney: {
      type: ['integer', 'null'],
    },
    chosen: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idCurrency',
    'isEnabled',
    'name',
    'precision',
    'symbol',
  ],
};
