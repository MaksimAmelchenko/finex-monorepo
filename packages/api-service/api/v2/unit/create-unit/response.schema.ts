import { OpenAPIV3 } from 'openapi-types';

import { unitSchema } from '../unit.schema';

export const createUnitResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    unit: unitSchema,
  },
  additionalProperties: false,
  required: ['unit'],
};
