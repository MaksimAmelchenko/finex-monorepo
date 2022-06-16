import { OpenAPIV3 } from 'openapi-types';
import { projectSchema } from '../project.schema';

export const getProjectsResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projects: {
      type: 'array',
      items: projectSchema,
    },
  },
  additionalProperties: false,
  required: ['projects'],
};
