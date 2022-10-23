import { OpenAPIV3_1 } from 'openapi-types';

import { categorySchema } from '../../../../common/schemas/category.schema';

export const getCategoryResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    category: categorySchema,
  },
  additionalProperties: false,
  required: ['category'],
};
