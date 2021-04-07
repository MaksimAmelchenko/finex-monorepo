import { OpenAPIV3 } from 'openapi-types';
import { userId } from './fields/user-id';
import { accountId } from './fields/account-id';
import { permit } from './fields/permit';

export const accountSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idAccount: accountId,
    idAccountType: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    permit,
    isEnabled: {
      type: 'boolean',
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
  required: [
    //
    'idUser',
    'idAccount',
    'idAccountType',
    'name',
    'note',
    'permit',
    'isEnabled',
    'readers',
    'writers',
  ],
};
