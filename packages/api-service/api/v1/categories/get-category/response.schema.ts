import { OpenAPIV3 } from 'openapi-types';
import { categorySchema } from '../../../../common/schemas/category.schema';

export const getCategoryResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    category: categorySchema,
  },
  additionalProperties: false,
  required: ['category'],
};
