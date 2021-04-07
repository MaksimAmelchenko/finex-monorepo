import { OpenAPIV3 } from 'openapi-types';
import { unitId } from '../../../../common/schemas/fields/unit-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';

export const createCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
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
    // frontend sends this
    chosen: {
      type: 'boolean',
    },

    idCategory: {
      type: 'integer',
      nullable: true,
    },
    idUser: {
      type: 'integer',
      nullable: true,
    },
    //
  },

  additionalProperties: false,
  required: ['parent', 'name', 'isEnabled', 'note'],
};
