import { OpenAPIV3_1 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';
import { fileSchema } from '../../../../common/schemas/file.schema';

export const uploadFilesParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    files: {
      type: 'array',
      items: fileSchema,
      minItems: 1,
    },
  },
  required: ['projectId', 'files'],
  additionalProperties: false,
};
