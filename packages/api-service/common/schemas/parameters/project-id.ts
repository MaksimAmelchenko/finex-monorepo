import { OpenAPIV3_1 } from 'openapi-types';

import { projectId as projectIdField } from '../fields/project-id';

export const projectId: OpenAPIV3_1.SchemaObject = {
  ...projectIdField,
  description: 'Taken from path',
};
