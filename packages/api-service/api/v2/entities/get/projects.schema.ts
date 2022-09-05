import { OpenAPIV3_1 } from 'openapi-types';

import { projectSchema } from '../../project/project.schema';

export const projectsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: projectSchema,
};
