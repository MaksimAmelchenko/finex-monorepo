import { OpenAPIV3_1 } from 'openapi-types';

import { password } from '../../../../common/schemas/fields/password';
import { locale } from '../../../../common/schemas/fields/locale';

export const signInParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      example: 'john',
    },
    password,
    locale,
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
