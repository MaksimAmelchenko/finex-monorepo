import { OpenAPIV3 } from 'openapi-types';
import { categoryId } from '../../../../common/schemas/fields/category-id';

export const moveCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategory: categoryId,
    idCategoryTo: categoryId,
    isRecursive: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: ['idCategory', 'idCategoryTo', 'isRecursive'],
};
