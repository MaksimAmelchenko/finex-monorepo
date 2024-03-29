import { OpenAPIV3_1 } from 'openapi-types';

import { currencySchema } from '../../currency/currency.schema';

export const currenciesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: currencySchema,
};
