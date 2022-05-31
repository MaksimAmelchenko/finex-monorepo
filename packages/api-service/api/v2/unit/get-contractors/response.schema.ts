import { OpenAPIV3 } from 'openapi-types';

import { unitSchema } from '../unit.schema';

export const getUnitsResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    units: {
      type: 'array',
      items: unitSchema,
    },
  },
  additionalProperties: false,
  required: ['units'],
};
