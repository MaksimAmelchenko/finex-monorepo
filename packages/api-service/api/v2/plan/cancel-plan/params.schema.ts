import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const cancelPlanParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    planId: id,
    exclusionDate: date,
    locale,
  },
  additionalProperties: false,
  required: [
    //
    'planId',
    'exclusionDate',
  ],
};
