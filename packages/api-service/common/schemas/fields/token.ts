import { OpenAPIV3 } from 'openapi-types';

export const token: OpenAPIV3.SchemaObject = {
  type: 'string',
  minLength: 1,
  example: 'e51fe3b5-ee18-470f-a2a5-cc55690c3144',
};
