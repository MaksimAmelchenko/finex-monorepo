import { OpenAPIV3_1 } from 'openapi-types';
import { userId } from './fields/user-id';

export const userSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    name: {
      type: 'string',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'john.doe@example.com',
    },
  },
  additionalProperties: false,
  required: ['idUser', 'name', 'email'],
};
