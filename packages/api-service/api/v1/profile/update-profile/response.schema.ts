import { OpenAPIV3 } from 'openapi-types';
import { profileSchema } from '../../../../common/schemas/profile.schema';

export const updateProfileResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    profile: profileSchema,
  },
  additionalProperties: false,
  required: ['profile'],
};
