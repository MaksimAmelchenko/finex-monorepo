import { OpenAPIV3 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/fields/project-id';

export const sessionSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
  },
  additionalProperties: false,
  required: ['projectId'],
};
