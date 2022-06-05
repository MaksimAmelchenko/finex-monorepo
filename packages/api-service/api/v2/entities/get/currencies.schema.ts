import { OpenAPIV3 } from 'openapi-types';

import { currencySchema } from '../../currency/currency.schema';

export const currenciesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: currencySchema,
};
