import { OpenAPIV3 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { id } from '../../../../common/schemas/fields/id';

export const updateAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    accountId,
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
  },
  additionalProperties: false,
  required: [
    //
    'accountId',
  ],
};
