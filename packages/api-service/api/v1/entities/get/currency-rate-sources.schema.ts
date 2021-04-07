import { OpenAPIV3 } from 'openapi-types';
import { currencyRateSourceSchema } from '../../../../common/schemas/currency-rate-source.schema';

export const currencyRateSourcesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: currencyRateSourceSchema,
};
