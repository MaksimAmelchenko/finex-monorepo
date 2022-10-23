import { OpenAPIV3_1 } from 'openapi-types';

import { password } from '../../../../common/schemas/fields/password';

export const deleteProfileParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    password,
  },
  required: ['password'],
  additionalProperties: false,
};
