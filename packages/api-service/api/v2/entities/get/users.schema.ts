import { OpenAPIV3 } from 'openapi-types';

import { userSchema } from '../../user/user.schema';

export const usersSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: userSchema,
};
