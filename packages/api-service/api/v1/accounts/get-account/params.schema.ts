import { OpenAPIV3 } from 'openapi-types';

export const getAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['idAccount'],
};
