import { OpenAPIV3_1 } from 'openapi-types';

import { contractorSchema } from '../contractor.schema';

export const createContractorResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractor: contractorSchema,
  },
  additionalProperties: false,
  required: ['contractor'],
};
