import { OpenAPIV3 } from 'openapi-types';

import { contractorSchema } from '../../contractor/contractor.schema';

export const contractorsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: contractorSchema,
};
