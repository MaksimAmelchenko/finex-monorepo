import { OpenAPIV3 } from 'openapi-types';
import { date } from '../../../../common/schemas/fields/date';

export const uploadCurrencyRatesParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    dateFrom: date,
    dateTo: date,
  },
  additionalProperties: false,
};
