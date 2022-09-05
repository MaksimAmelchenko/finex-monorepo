import { OpenAPIV3_1 } from 'openapi-types';

import { userId as userIdField } from '../fields/user-id';

export const userId: OpenAPIV3_1.SchemaObject = {
  ...userIdField,
  description: 'Taken from path',
};
