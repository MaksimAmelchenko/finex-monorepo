import { OpenAPIV3 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';
import { fileId } from '../../../../common/schemas/parameters/file-id';

export const deleteFileParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    fileId,
  },
  required: ['accountId', 'fileId'],
  additionalProperties: false,
};
