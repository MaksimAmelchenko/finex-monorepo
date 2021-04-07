import { OpenAPIV3 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';

export const resetPasswordRequestParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    email,
  },
  required: ['email'],
  additionalProperties: false,
};
