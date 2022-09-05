import { OpenAPIV3_1 } from 'openapi-types';

import { token } from '../../../../common/schemas/parameters/token';
import { password } from '../../../../common/schemas/fields/password';

export const confirmResetPasswordRequestParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    token,
    password,
  },
  required: ['token'],
};
