import { OpenAPIV3_1 } from 'openapi-types';
import { categorySchema } from '../../../../common/schemas/category.schema';

export const getCategoriesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    categories: {
      type: 'array',
      items: categorySchema,
    },
  },
  additionalProperties: false,
  required: ['categories'],
};
