import { OpenAPIV3_1 } from 'openapi-types';

import { contractorSchema } from '../contractor.schema';

export const getContractorsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractors: {
      type: 'array',
      items: contractorSchema,
    },
  },
  additionalProperties: false,
  required: ['contractors'],
};
