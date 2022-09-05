import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';

export const findTransfersParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
      maximum: 50,
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
    accountsFrom: {
      type: 'string',
      example: '1,2,3',
    },
    accountsTo: {
      type: 'string',
      example: '1,2,3',
    },
    tags: {
      type: 'string',
      example: '1,2,3',
    },
  },
  additionalProperties: false,
  // required: [],
};
