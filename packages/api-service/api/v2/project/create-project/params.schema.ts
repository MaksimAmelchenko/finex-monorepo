import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const createProjectParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
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
  required: ['name'],
};
