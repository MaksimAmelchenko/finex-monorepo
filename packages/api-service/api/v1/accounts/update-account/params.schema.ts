import { OpenAPIV3 } from 'openapi-types';
import { accountId } from '../../../../common/schemas/fields/account-id';

export const updateAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount: accountId,
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
