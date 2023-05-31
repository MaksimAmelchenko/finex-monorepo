import { OpenAPIV3_1 } from 'openapi-types';

import { ConnectionProvider } from '../../../../modules/connection/types';
import { accountSchema } from '../account.schema';
import { id } from '../../../../common/schemas/fields/id';

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
            items: accountSchema,
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
