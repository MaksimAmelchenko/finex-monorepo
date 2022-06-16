import { OpenAPIV3 } from 'openapi-types';

import { projectSchema } from '../../project/project.schema';

export const projectsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: projectSchema,
};
