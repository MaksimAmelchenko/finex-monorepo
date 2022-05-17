import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const createAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    accountTypeId: id,
    isEnabled: {
      type: 'boolean',
      default: true,
    },
    note: {
      type: 'string',
    },
    readers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    writers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: [
    //
    'name',
    'accountTypeId',
  ],
};
