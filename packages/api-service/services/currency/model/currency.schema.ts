import { OpenAPIV3_1 } from 'openapi-types';

export const currencySchema: OpenAPIV3_1.SchemaObject = {
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
