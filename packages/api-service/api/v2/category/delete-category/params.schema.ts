import { OpenAPIV3 } from 'openapi-types';

import { categoryId } from '../../../../common/schemas/fields/category-id';

export const deleteCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    categoryId,
  },
  additionalProperties: false,
  required: ['categoryId'],
};
