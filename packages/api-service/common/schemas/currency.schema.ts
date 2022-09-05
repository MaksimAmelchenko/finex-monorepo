import { OpenAPIV3_1 } from 'openapi-types';

export const currencySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCurrency: {
      type: 'integer',
      example: 860,
    },
    name: {
      type: 'string',
      example: 'Доллар США',
    },
    shortName: {
      type: 'string',
      example: 'дол',
    },
    symbol: {
      type: 'string',
      example: '$',
    },
    code: {
      type: 'string',
      example: 'USD',
    },
  },
  additionalProperties: false,
  required: ['idCurrency', 'name', 'shortName', 'symbol', 'code'],
};
