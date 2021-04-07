import { OpenAPIV3 } from 'openapi-types';

import { token } from '../../../../common/schemas/parameters/token';
import { password } from '../../../../common/schemas/fields/password';

export const confirmResetPasswordRequestParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    token,
    password,
  },
  required: ['token'],
};
