import { OpenAPIV3_1 } from 'openapi-types';

export const email: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  format: 'email',
  minLength: 1,
  example: 'john.doe@gmail.com',
};
