import { OpenAPIV3_1 } from 'openapi-types';

import { moneyId } from '../../../common/schemas/fields/money-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const moneySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: moneyId,
    currencyId: {
      type: ['string', 'null'],
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    precision: {
      type: ['integer', 'null'],
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: ['integer', 'null'],
    },
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'currencyId',
    'name',
    'symbol',
    'precision',
    'isEnabled',
    'sorting',
    'userId',
  ],
};
