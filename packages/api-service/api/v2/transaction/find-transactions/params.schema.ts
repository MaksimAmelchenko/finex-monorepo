import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { locale } from '../../../../common/schemas/fields/locale';
import { sign } from '../../../../common/schemas/fields/sign';

export const findTransactionsParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
    },
    offset: {
      type: 'integer',
      minimum: 0,
    },
    searchText: {
      type: 'string',
      example: 'food',
    },
    startDate: date,
    endDate: date,
    sign,
    contractors: {
      type: 'string',
      example: '1,2,3',
    },
    accounts: {
      type: 'string',
      example: '1,2,3',
    },
    categories: {
      type: 'string',
      example: '1,2,3',
    },
    tags: {
      type: 'string',
      example: '1,2,3',
    },
    locale,
  },
  additionalProperties: false,
};
