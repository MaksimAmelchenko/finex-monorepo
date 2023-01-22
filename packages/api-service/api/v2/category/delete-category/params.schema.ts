import { OpenAPIV3_1 } from 'openapi-types';

import { categoryId } from '../../../../common/schemas/fields/category-id';
import { locale } from '../../../../common/schemas/fields/locale';

export const deleteCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    categoryId,
    locale,
  },
  additionalProperties: false,
  required: ['categoryId'],
};
