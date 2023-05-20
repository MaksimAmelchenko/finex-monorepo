import { OpenAPIV3_1 } from 'openapi-types';

import { i18n } from '../../../common/schemas/fields/i18n';

export const countryDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
    },
    name: i18n({ type: 'string' }),
  },
  additionalProperties: false,
  required: [
    //
    'code',
    'name',
  ],
};
