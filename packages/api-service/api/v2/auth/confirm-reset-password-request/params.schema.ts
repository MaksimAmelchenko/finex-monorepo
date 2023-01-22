import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { password } from '../../../../common/schemas/fields/password';
import { token } from '../../../../common/schemas/parameters/token';

export const confirmResetPasswordRequestParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    token,
    password,
    locale,
  },
  required: ['token'],
};
