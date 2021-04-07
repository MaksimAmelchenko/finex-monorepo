import { OpenAPIV3 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';
import { projectId } from '../../../../common/schemas/fields/project-id';
import { password } from '../../../../common/schemas/fields/password';
import { userId } from '../../../../common/schemas/fields/user-id';

export const updateProfileParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    password,
    idUser: userId,
    email,
    isChangePassword: {
      type: 'boolean',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    idProject: projectId,
    idCurrencyRateSource: {
      type: 'integer',
    },
    newPassword: password,
  },
  additionalProperties: false,
  required: ['password'],
};
