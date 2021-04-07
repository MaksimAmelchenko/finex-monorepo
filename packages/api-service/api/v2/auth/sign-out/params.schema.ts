import { OpenAPIV3 } from 'openapi-types';

export const signOutParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    isEverywhere: {
      type: 'boolean',
      default: false,
      example: 'true',
    },
  },
  additionalProperties: false,
};
