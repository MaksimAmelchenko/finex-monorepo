import { OpenAPIV3_1 } from 'openapi-types';

export const signOutParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    isEverywhere: {
      type: 'boolean',
      example: true,
    },
  },
  additionalProperties: false,
};
