import { OpenAPIV3 } from 'openapi-types';

export const emptySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};
