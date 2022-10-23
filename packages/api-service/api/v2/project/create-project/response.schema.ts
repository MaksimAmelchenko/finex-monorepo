import { OpenAPIV3_1 } from 'openapi-types';

import { projectSchema } from '../project.schema';

export const createProjectResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    project: projectSchema,
  },
  additionalProperties: false,
  required: ['project'],
};
