import { OpenAPIV3_1 } from 'openapi-types';

export const duration: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  format: 'duration',
  example: 'PT30M',
};
