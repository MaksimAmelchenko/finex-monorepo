import { OpenAPIV3_1 } from 'openapi-types';

export const moneyDAOSchema: OpenAPIV3_1.SchemaObject = {
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
    currencyCode: {
      type: ['string', 'null'],
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    precision: {
      type: ['number', 'null'],
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: ['number', 'null'],
    },
  },
  additionalProperties: false,
  required: ['idProject', 'name', 'symbol', 'isEnabled'],
};
