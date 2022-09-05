import { OpenAPIV3_1 } from 'openapi-types';

export const currencyRateSourceSchema: OpenAPIV3_1.SchemaObject = {
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
