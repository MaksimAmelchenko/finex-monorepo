import { OpenAPIV3 } from 'openapi-types';

export const email: OpenAPIV3.SchemaObject = {
  type: 'string',
  format: 'email',
  minLength: 1,
  example: 'john.doe@gmail.com',
};
