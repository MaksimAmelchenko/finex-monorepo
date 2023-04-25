import { OpenAPIV3_1 } from 'openapi-types';

import { i18n } from '../../../common/schemas/fields/i18n';

export const accountTypeDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    name: i18n({ type: 'string' }),
  },
  additionalProperties: false,
  required: ['id', 'name'],
};
