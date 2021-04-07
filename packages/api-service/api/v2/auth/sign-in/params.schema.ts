import { OpenAPIV3 } from 'openapi-types';

import { password } from '../../../../common/schemas/fields/password';

export const signInParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      example: 'john',
    },
    password,
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
