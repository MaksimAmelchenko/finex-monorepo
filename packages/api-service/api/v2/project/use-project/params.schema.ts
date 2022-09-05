import { OpenAPIV3_1 } from 'openapi-types';

import { projectId } from '../../../../common/schemas/parameters/project-id';

export const useProjectParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
  },
  additionalProperties: false,
};
