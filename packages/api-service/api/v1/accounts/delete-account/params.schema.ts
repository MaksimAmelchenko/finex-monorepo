import { OpenAPIV3 } from 'openapi-types';

export const deleteAccountParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['idAccount'],
};
