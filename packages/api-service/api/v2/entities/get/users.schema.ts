import { OpenAPIV3 } from 'openapi-types';
import { userSchema } from '../../../../common/schemas/user.schema';

export const usersSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: userSchema,
};
