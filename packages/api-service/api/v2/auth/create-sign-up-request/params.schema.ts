import { OpenAPIV3 } from 'openapi-types';

import { email } from '../../../../common/schemas/fields/email';

export const createSignUpRequestParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      example: 'John Doe',
    },
    email,
    password: {
      type: 'string',
      minLength: 6,
      example: 'c02483ead2fec6bb5d3c3184c33fe025d5ab483082b18cf2f676e21cbec26c40',
    },
    isAcceptTerms: {
      type: 'boolean',
      enum: [true],
      example: true,
      description: 'I accept the terms',
    },
    recaptcha: {
      type: 'string',
    },
  },
  required: ['name', 'email', 'password', 'isAcceptTerms'],
  additionalProperties: false,
};
