import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const renewSubscriptionsParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    secret: {
      type: 'string',
    },
    locale,
  },
  additionalProperties: false,
  required: ['secret'],
};
