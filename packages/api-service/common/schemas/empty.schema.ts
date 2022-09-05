import { OpenAPIV3_1 } from 'openapi-types';

export const emptySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};
