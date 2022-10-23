import { OpenAPIV3_1 } from 'openapi-types';

import { password } from '../../../../common/schemas/fields/password';

export const changePasswordParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    password,
    newPassword: password,
  },
  additionalProperties: false,
  required: ['password', 'newPassword'],
};
