import { OpenAPIV3 } from 'openapi-types';

export const currencyRateSourceSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCurrencyRateSource: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idCurrencyRateSource', 'name'],
};
