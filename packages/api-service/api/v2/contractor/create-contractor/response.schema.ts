import { OpenAPIV3 } from 'openapi-types';

import { contractorSchema } from '../contractor.schema';

export const createContractorResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    contractor: contractorSchema,
  },
  additionalProperties: false,
  required: ['contractor'],
};
