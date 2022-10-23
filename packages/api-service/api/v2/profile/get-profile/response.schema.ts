import { OpenAPIV3_1 } from 'openapi-types';

import { profileSchema } from '../profile.schema';

export const getProfileResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    profile: profileSchema,
  },
  additionalProperties: false,
  required: ['profile'],
};
