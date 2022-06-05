import { OpenAPIV3 } from 'openapi-types';

import { moneyId } from '../../../common/schemas/fields/money-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const moneySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: moneyId,
    currencyId: {
      type: 'string',
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
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: 'integer',
      nullable: true,
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
