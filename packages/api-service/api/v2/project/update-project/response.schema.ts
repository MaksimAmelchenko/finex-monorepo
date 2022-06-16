import { OpenAPIV3 } from 'openapi-types';
import { projectSchema } from '../project.schema';

export const updateProjectResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    project: projectSchema,
  },
  additionalProperties: false,
  required: ['project'],
};
