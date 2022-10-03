import { OpenAPIV3_1 } from 'openapi-types';

import { categoryId } from '../../../../common/schemas/fields/category-id';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const updateCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    categoryId,
    name: {
      type: 'string',
    },
    parent: {
      ...categoryId,
      type: ['integer', 'null'],
    },
    categoryPrototypeId: {
      type: ['string', 'null'],
    },
    isEnabled: {
      type: 'boolean',
    },
    note: {
      type: 'string',
    },
    unitId: {
      ...unitId,
      type: ['integer', 'null'],
    },
  },
  additionalProperties: false,
  required: ['categoryId'],
};
