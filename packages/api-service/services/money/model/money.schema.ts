import { OpenAPIV3 } from 'openapi-types';

export const moneySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idMoney: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    idCurrency: {
      type: 'number',
      nullable: true,
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    precision: {
      type: 'number',
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: 'number',
      nullable: true,
    },
  },
  additionalProperties: false,
  required: ['idProject', 'idCurrency', 'name', 'symbol', 'isEnabled'],
};
