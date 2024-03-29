import { OpenAPIV3_1 } from 'openapi-types';

import { categoryPrototypeSchema } from './category-prototype.schema';

export const categoryPrototypesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: categoryPrototypeSchema,
};
