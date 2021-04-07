import { OpenAPIV3 } from 'openapi-types';
import { unitId } from '../../../../common/schemas/fields/unit-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';

export const updateCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategory: categoryId,
    idCategoryPrototype: {
      type: 'integer',
      nullable: true,
    },
    idUnit: {
      ...unitId,
    },
    isEnabled: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    parent: {
      ...categoryId,
      nullable: true,
    },
  },

  additionalProperties: false,
  required: ['idCategory'],
};
