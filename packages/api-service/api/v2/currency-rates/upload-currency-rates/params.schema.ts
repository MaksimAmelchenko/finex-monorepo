import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { locale } from '../../../../common/schemas/fields/locale';

export const uploadCurrencyRatesParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    dateFrom: date,
    dateTo: date,
    secret: {
      type: 'string',
    },
    locale,
  },
  additionalProperties: false,
  required: ['secret'],
};
