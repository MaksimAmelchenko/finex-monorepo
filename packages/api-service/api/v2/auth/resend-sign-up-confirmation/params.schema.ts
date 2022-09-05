import { OpenAPIV3_1 } from 'openapi-types';

export const resendSignUpConfirmationParamsSchema: OpenAPIV3_1.SchemaObject = {
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
