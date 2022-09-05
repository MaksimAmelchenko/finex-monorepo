import { OpenAPIV3_1 } from 'openapi-types';
import { currencyRateSourceSchema } from '../../../../common/schemas/currency-rate-source.schema';

export const currencyRateSourcesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: currencyRateSourceSchema,
};
