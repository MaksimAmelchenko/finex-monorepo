import { OpenAPIV3_1 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';
import { fileId } from '../../../../common/schemas/parameters/file-id';

export const getFileParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    fileId,
  },
  required: ['projectId', 'fileId'],
  additionalProperties: false,
};
