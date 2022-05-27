import { OpenAPIV3 } from 'openapi-types';

import { categoryId } from '../../../../common/schemas/fields/category-id';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const createCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    parent: {
      ...categoryId,
      nullable: true,
    },
    categoryPrototypeId: {
      type: 'string',
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
      default: true,
    },
    note: {
      type: 'string',
    },
    unitId: {
      ...unitId,
      nullable: true,
    },
  },

  additionalProperties: false,
  required: ['name'],
};
