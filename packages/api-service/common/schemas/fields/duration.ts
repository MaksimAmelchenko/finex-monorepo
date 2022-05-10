import { OpenAPIV3 } from 'openapi-types';

export const duration: OpenAPIV3.SchemaObject = {
  type: 'string',
  format: 'duration',
  example: 'PT30M',
};
