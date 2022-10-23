import { OpenAPIV3_1 } from 'openapi-types';

import { categorySchema } from '../../../../common/schemas/category.schema';

export const categoriesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: categorySchema,
};
