import { OpenAPIV3 } from 'openapi-types';

import { idAccount } from '../../../../common/schemas/fields/id-account';

export const updateAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount,
    idAccountType: {
      type: 'integer',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    isEnabled: {
      type: 'boolean',
    },
    note: {
      type: 'string',
    },
    readers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    writers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
  },

  additionalProperties: false,
  required: ['idAccount'],
};
