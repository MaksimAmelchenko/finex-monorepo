import { OpenAPIV3_1 } from 'openapi-types';
import { unitSchema } from '../../unit/unit.schema';

export const unitsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: unitSchema,
};
