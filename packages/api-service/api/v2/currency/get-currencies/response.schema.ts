import { OpenAPIV3_1 } from 'openapi-types';

import { currencySchema } from '../currency.schema';

export const getCurrenciesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    currencies: {
      type: 'array',
      items: currencySchema,
    },
  },
  additionalProperties: false,
  required: ['currencies'],
};
