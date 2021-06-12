import { OpenAPIV3 } from 'openapi-types';
import { contractorSchema } from '../../../../common/schemas/contractor.schema';

export const contractorsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: contractorSchema,
};
