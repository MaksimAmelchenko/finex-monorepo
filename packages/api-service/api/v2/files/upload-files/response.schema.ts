import { OpenAPIV3 } from 'openapi-types';

import { fileSchema } from '../file.schema';

export const uploadFilesResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    files: {
      type: 'array',
      items: fileSchema,
      minItems: 1,
    },
  },
  required: ['files'],
  additionalProperties: false,
};
