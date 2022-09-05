import { OpenAPIV3_1 } from 'openapi-types';

import { idUser } from './fields/id-user';
import { idAccount } from './fields/id-account';
import { permit } from './fields/permit';

export const accountSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idAccount,
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
