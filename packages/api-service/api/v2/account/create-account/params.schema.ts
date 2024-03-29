import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const createAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
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
    'name',
    'accountTypeId',
  ],
};
