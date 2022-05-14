import { OpenAPIV3 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';

export const cancelPlanParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    planId: id,
    excludedDate: date,
  },
  additionalProperties: false,
  required: [
    //
    'planId',
    'excludedDate',
  ],
};
