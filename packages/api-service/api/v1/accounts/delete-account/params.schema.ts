import { OpenAPIV3_1 } from 'openapi-types';

export const deleteAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idAccount: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['idAccount'],
};
