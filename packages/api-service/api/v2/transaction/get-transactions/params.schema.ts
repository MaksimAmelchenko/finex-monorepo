import { OpenAPIV3 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { sign } from '../../../../common/schemas/fields/sign';

export const getTransactionParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
      default: 50,
    },
    offset: {
      type: 'integer',
      minimum: 0,
      default: 0,
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
  },
  additionalProperties: false,
};
