import { OpenAPIV3_1 } from 'openapi-types';

import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';

export const accountDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    id,
    connectionId: id,
    providerAccountId: {
      type: 'string',
    },
    providerAccountName: {
      type: 'string',
    },
    providerAccountProduct: {
      type: ['string', 'null'],
    },
    accountId: {
      type: ['number', 'null'],
    },
    syncFrom: {
      type: ['string', 'null'],
    },
    createdAt: dateTime,
    updatedAt: dateTime,
    lastSyncedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'id',
    'connectionId',
    'providerAccountId',
    'providerAccountName',
  ],
};
