import { OpenAPIV3 } from 'openapi-types';
import { categorySchema } from '../../../../common/schemas/category.schema';

export const getCategoriesResponseSchema: OpenAPIV3.SchemaObject = {
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
