import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { TDateTime } from '../../../types/app';

export const sessionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    idUser: {
      type: 'number',
    },
    idProject: {
      type: 'number',
    },
    lastAccessTime: dateTime,
    ip: {
      type: 'string',
    },
    requestsCount: {
      type: 'integer',
    },
    timeout: {
      type: 'string',
    },
    userAgent: {
      type: 'string',
    },
    isActive: {
      type: 'boolean',
    },
    accessUntil: dateTime,
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'idUser',
    'idProject',
    'lastAccessTime',
    'ip',
    'requestsCount',
    'timeout',
    'isActive',
    'userAgent',
    'accessUntil',
  ],
};
