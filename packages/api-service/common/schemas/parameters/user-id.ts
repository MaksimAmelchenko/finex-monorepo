import { OpenAPIV3 } from 'openapi-types';

import { userId as userIdField } from '../fields/user-id';

export const userId: OpenAPIV3.SchemaObject = {
  ...userIdField,
  description: 'Taken from path',
};
