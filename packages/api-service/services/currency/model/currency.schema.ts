import { OpenAPIV3 } from 'openapi-types';

export const currencySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCurrency: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    shortName: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    code: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idCurrency', 'name', 'shortName', 'symbol', 'code'],
};
