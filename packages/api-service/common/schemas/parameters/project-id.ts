import { OpenAPIV3 } from 'openapi-types';

import { projectId as projectIdField } from '../fields/project-id';

export const projectId: OpenAPIV3.SchemaObject = {
  ...projectIdField,
  description: 'Taken from path',
};
