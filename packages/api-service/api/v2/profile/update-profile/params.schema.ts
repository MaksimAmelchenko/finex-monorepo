import { OpenAPIV3_1 } from 'openapi-types';

import { duration } from '../../../../common/schemas/fields/duration';
import { projectId } from '../../../../common/schemas/fields/project-id';

export const updateProfileParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    projectId,
    currencyRateSourceId: {
      type: 'string',
    },
    timeout: duration,
  },
  additionalProperties: false,
};
