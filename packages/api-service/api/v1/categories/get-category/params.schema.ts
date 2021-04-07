import { OpenAPIV3 } from 'openapi-types';
import { categoryId } from '../../../../common/schemas/fields/category-id';

export const getCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategory: categoryId,
  },
  additionalProperties: false,
  required: ['idCategory'],
};
