import { OpenAPIV3_1 } from 'openapi-types';

import { ConnectionProvider } from '../../../../modules/connection/types';

export const getInstitutionsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    institutions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          bic: {
            type: 'string',
          },
          logo: {
            type: 'string',
            format: 'uri',
          },
          provider: {
            type: 'string',
            enum: [ConnectionProvider.Nordigen],
          },
        },
        additionalProperties: false,
        required: [
          //
          'id',
          'name',
          'bic',
          'logo',
          'provider',
        ],
      },
    },
  },
  additionalProperties: false,
  required: ['institutions'],
};
