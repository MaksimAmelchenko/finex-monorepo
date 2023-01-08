import { OpenAPIV3_1 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';
import { locale } from '../../../../common/schemas/fields/locale';

export const resetPasswordRequestParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    email,
    locale,
  },
  required: ['email'],
  additionalProperties: false,
};
