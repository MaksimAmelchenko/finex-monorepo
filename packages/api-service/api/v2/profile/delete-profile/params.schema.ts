import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { password } from '../../../../common/schemas/fields/password';

export const deleteProfileParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    password,
    locale,
  },
  required: ['password'],
  additionalProperties: false,
};
