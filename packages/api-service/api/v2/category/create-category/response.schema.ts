import { OpenAPIV3_1 } from 'openapi-types';
import { categorySchema } from '../category.schema';

export const createCategoryResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    category: categorySchema,
  },
  additionalProperties: false,
  required: ['category'],
};
