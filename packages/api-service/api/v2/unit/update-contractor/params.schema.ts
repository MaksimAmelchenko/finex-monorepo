import { OpenAPIV3 } from 'openapi-types';

import { unitId } from '../../../../common/schemas/fields/unit-id';

export const updateUnitParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    unitId,
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['unitId'],
};
