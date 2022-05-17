import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';
import { permit } from '../../../common/schemas/fields/permit';
import { userId } from '../../../common/schemas/fields/user-id';

export const accountSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id,
    name: {
      type: 'string',
    },
    accountTypeId: id,
    isEnabled: {
      type: 'boolean',
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
    permit,
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'accountTypeId',
    'isEnabled',
    'note',
    'readers',
    'writers',
    'permit',
    'userId',
  ],
};
