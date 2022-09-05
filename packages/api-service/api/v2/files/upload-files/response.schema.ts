import { OpenAPIV3_1 } from 'openapi-types';

import { fileSchema } from '../file.schema';

export const uploadFilesResponseSchema: OpenAPIV3_1.SchemaObject = {
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
