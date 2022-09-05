import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const createMoneyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    currencyId: {
      ...id,
      type: ['integer', 'null'],
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    precision: {
      type: 'integer',
    },
    isEnabled: {
      type: ['boolean', 'null'],
      default: true,
    },
    sorting: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: [
    //
    'name',
    'symbol',
    'precision',
    'isEnabled',
  ],
};
