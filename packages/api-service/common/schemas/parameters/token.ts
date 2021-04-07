import { OpenAPIV3 } from 'openapi-types';

export const token: OpenAPIV3.SchemaObject = {
  type: 'string',
  minLength: 1,
  description: 'Taken from path',
  example: '2497afaa-b03c-4b05-9c0c-7088cbadf4be',
};
