import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { ConnectionProvider } from '../../../../modules/connection/types';

export const getConnectionsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    connections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id,
          institutionName: {
            type: 'string',
          },
          institutionLogo: {
            type: 'string',
          },
          provider: {
            type: 'string',
            enum: [ConnectionProvider.Nordigen],
          },
          accounts: {
            type: 'array',
            items: {
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
            },
          },
        },
        additionalProperties: false,
        required: [
          //
          'id',
          'institutionName',
          'institutionLogo',
          'provider',
          'accounts',
        ],
      },
    },
  },
  additionalProperties: false,
  required: ['connections'],
};
