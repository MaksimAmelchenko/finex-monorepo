import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { projectId } from '../../../../common/schemas/parameters/project-id';

export const mergeProjectParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    projects: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
    },
    locale,
  },
  additionalProperties: false,
  required: ['projectId', 'projects'],
};
