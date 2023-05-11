import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';
import { dateTime } from '../../../common/schemas/fields/date-time';

export const requisitionDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    id,
    requisitionId: {
      type: 'string',
    },
    institutionId: {
      type: 'string',
    },
    connectionId: {
      type: ['string', 'null'],
    },
    status: {
      type: 'string',
    },
    responses: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'id',
    'requisitionId',
    'institutionId',
    'status',
    'responses',
  ],
};
