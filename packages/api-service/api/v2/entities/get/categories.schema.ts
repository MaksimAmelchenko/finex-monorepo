import { OpenAPIV3 } from 'openapi-types';
import { categorySchema } from '../../category/category.schema';

export const categoriesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: categorySchema,
};
