import { OpenAPIV3 } from 'openapi-types';
import { projectId } from '../../../../common/schemas/parameters/project-id';

export const useProjectParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idProject: projectId,
  },
  additionalProperties: false,
};
