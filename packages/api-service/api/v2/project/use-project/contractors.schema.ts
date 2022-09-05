import { OpenAPIV3_1 } from 'openapi-types';

import { contractorSchema } from '../../contractor/contractor.schema';

export const contractorsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: contractorSchema,
};
