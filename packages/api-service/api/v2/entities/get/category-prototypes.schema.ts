import { OpenAPIV3 } from 'openapi-types';

import { categoryPrototypeSchema } from './category-prototype.schema';

export const categoryPrototypesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: categoryPrototypeSchema,
};
