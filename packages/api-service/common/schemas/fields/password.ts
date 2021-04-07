import { OpenAPIV3 } from 'openapi-types';

export const password: OpenAPIV3.SchemaObject = {
  type: 'string',
  minLength: 1,
  example: 'c02483ead2fec6bb5d3c3184c33fe025d5ab483082b18cf2f676e21cbec26c40',
};
