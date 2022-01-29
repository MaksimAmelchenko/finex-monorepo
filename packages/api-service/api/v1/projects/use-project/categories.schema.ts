import { OpenAPIV3 } from 'openapi-types';
import { categorySchema } from '../../../../common/schemas/category.schema';

export const categoriesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: categorySchema,
};
