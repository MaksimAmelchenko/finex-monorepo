import { OpenAPIV3 } from 'openapi-types';
import { projectSchema } from '../project.schema';

export const createProjectResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    project: projectSchema,
  },
  additionalProperties: false,
  required: ['project'],
};
