import { OpenAPIV3 } from 'openapi-types';

import { contractorSchema } from '../contractor.schema';

export const getContractorsResponseSchema: OpenAPIV3.SchemaObject = {
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
