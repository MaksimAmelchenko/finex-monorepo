import { OpenAPIV3_1 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';

export const updateProjectParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    editors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: ['projectId'],
};