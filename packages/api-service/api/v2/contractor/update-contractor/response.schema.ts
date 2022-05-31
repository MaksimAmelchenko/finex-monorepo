import { OpenAPIV3 } from 'openapi-types';

import { contractorSchema } from '../contractor.schema';

export const updateContractorResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    contractor: contractorSchema,
  },
  additionalProperties: false,
  required: ['contractor'],
};
