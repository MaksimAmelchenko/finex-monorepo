import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { projectId } from '../../../../common/schemas/parameters/project-id';

export const deleteProjectParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    locale,
  },
  additionalProperties: false,
  required: ['projectId'],
};
