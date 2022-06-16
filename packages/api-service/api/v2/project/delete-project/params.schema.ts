import { OpenAPIV3 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';

export const deleteProjectParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
  },
  additionalProperties: false,
  required: ['projectId'],
};
