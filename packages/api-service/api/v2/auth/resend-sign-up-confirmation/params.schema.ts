import { OpenAPIV3 } from 'openapi-types';

export const resendSignUpConfirmationParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    signUpRequestId: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['signUpRequestId'],
  additionalProperties: false,
};
