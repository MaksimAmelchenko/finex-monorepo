import { OpenAPIV3_1 } from 'openapi-types';
import { contractorSchema } from '../../../../common/schemas/contractor.schema';

export const contractorsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: contractorSchema,
};
