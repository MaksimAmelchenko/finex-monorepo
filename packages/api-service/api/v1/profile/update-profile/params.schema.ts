import { OpenAPIV3 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';
import { idProject } from '../../../../common/schemas/fields/id-project';
import { password } from '../../../../common/schemas/fields/password';
import { idUser } from '../../../../common/schemas/fields/id-user';

export const updateProfileParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    password,
    idUser,
    email,
    isChangePassword: {
      type: 'boolean',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    idProject,
    idCurrencyRateSource: {
      type: 'integer',
    },
    newPassword: password,
  },
  additionalProperties: false,
  required: ['password'],
};
