import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';
import { permit } from '../../../common/schemas/fields/permit';
import { userId } from '../../../common/schemas/fields/user-id';

export const accountSchema: OpenAPIV3_1.SchemaObject = {
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
    viewers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    editors: {
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
    'viewers',
    'editors',
    'permit',
    'userId',
  ],
};
