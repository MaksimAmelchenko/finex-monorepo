import { OpenAPIV3_1 } from 'openapi-types';

import { dateTime } from '../../../../common/schemas/fields/date-time';

export const accessPeriodDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    userId: {
      type: 'number',
    },
    planId: {
      type: 'string',
    },
    startAt: dateTime,
    endAt: dateTime,
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'userId',
    'planId',
    'startAt',
    'endAt',
  ],
};
