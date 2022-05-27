import { OpenAPIV3 } from 'openapi-types';

import { categoryId } from '../../../../common/schemas/fields/category-id';

export const moveCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    categoryId,
    categoryIdTo: categoryId,
    isRecursive: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: ['categoryId', 'categoryIdTo', 'isRecursive'],
};
