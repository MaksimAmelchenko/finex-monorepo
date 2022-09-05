import { OpenAPIV3_1 } from 'openapi-types';

import { userSchema } from '../../user/user.schema';

export const usersSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: userSchema,
};
