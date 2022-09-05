import { OpenAPIV3_1 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';

export const resetPasswordRequestParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    email,
  },
  required: ['email'],
  additionalProperties: false,
};
