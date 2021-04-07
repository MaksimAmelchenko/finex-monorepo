import { OpenAPIV3 } from 'openapi-types';
import { userId } from './fields/user-id';
import { moneyId } from './fields/money-id';

export const moneySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idMoney: moneyId,
    idCurrency: {
      type: 'integer',
      nullable: true,
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
      type: 'integer',
      nullable: true,
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
