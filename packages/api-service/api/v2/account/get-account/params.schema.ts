import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const getAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accountId: {
      type: 'string',
    },
    locale,
  },
  additionalProperties: false,
  required: ['accountId'],
};
