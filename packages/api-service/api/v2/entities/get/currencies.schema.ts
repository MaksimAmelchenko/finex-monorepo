import { OpenAPIV3 } from 'openapi-types';
import { currencySchema } from '../../../../common/schemas/currency.schema';

export const currenciesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: currencySchema,
};
