import { OpenAPIV3_1 } from 'openapi-types';

import { idProject } from '../../../../common/schemas/fields/id-project';

export const sessionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idProject,
  },
  required: ['idProject'],
  additionalProperties: false,
};
