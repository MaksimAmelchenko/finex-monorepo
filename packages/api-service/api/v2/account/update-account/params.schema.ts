import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const updateAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
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
    locale,
  },
  additionalProperties: false,
  required: [
    //
    'accountId',
  ],
};
