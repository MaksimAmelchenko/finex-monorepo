import { OpenAPIV3 } from 'openapi-types';

export const password: OpenAPIV3.SchemaObject = {
  type: 'string',
  minLength: 1,
  example: 'c02483ead2fec6b',
};
