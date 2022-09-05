import { OpenAPIV3_1 } from 'openapi-types';

import { unitId } from '../../../../common/schemas/fields/unit-id';

export const deleteUnitParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    unitId,
  },
  additionalProperties: false,
  required: ['unitId'],
};
