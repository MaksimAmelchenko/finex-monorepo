import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const signOutParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    isEverywhere: {
      type: 'boolean',
      example: true,
    },
    locale,
  },
  additionalProperties: false,
};
