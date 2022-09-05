import { OpenAPIV3_1 } from 'openapi-types';

import { unitSchema } from '../unit.schema';

export const createUnitResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    unit: unitSchema,
  },
  additionalProperties: false,
  required: ['unit'],
};
