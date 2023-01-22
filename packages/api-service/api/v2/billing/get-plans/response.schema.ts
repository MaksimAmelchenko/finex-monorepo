import { OpenAPIV3_1 } from 'openapi-types';

import { planSchema } from './plan.schema';

export const getPlansResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    plans: {
      type: 'array',
      items: planSchema,
    },
  },
  additionalProperties: false,
  required: ['plans'],
};
