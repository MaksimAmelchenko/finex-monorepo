import { OpenAPIV3 } from 'openapi-types';
import { unitSchema } from '../../../../common/schemas/unit.schema';

export const unitsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: unitSchema,
};
