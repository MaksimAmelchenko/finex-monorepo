import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

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
    },
    sorting: {
      type: 'integer',
    },
    locale,
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
