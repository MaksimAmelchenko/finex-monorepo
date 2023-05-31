import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';

export const accountSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    providerAccountId: {
      type: 'string',
    },
    providerAccountName: {
      type: 'string',
    },
    providerAccountProduct: {
      type: 'string',
    },
    accountId: {
      type: ['string', 'null'],
    },
    syncFrom: {
      type: ['string', 'null'],
      format: 'date',
    },
    lastSyncedAt: {
      type: ['string', 'null'],
      format: 'date-time',
    },
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'providerAccountId',
    'providerAccountName',
    'providerAccountProduct',
    'accountId',
    'syncFrom',
    'lastSyncedAt',
  ],
};
