import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { token } from '../../../../common/schemas/parameters/token';

export const confirmSignUpRequestParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    token,
    locale,
  },
  required: ['token'],
};
