import { OpenAPIV3_1 } from 'openapi-types';

import { idCategory } from '../../../../common/schemas/fields/id-category';

export const moveCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategory,
    idCategoryTo: idCategory,
    isRecursive: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: ['idCategory', 'idCategoryTo', 'isRecursive'],
};
