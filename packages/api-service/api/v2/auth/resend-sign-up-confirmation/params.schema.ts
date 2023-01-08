import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const resendSignUpConfirmationParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    signUpRequestId: {
      type: 'string',
      format: 'uuid',
    },
    locale,
  },
  required: ['signUpRequestId'],
  additionalProperties: false,
};
