import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const deleteUnitParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    unitId,
    locale,
  },
  additionalProperties: false,
  required: ['unitId'],
};
