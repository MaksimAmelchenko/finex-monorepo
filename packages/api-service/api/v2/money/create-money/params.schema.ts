import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const createMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    currencyId: {
      ...id,
      nullable: true,
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
      type: 'boolean',
      nullable: true,
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
