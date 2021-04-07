import { OpenAPIV3 } from 'openapi-types';
import { userId } from './fields/user-id';
import { categoryId } from './fields/category-id';
import { unitId } from './fields/unit-id';

export const categorySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idCategory: categoryId,
    parent: {
      ...categoryId,
      nullable: true,
    },
    idCategoryPrototype: {
      type: 'integer',
      nullable: true,
    },
    idUnit: {
      ...unitId,
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
    },
    isSystem: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    'idUser',
    'idCategory',
    'parent',
    'idCategoryPrototype',
    'idUnit',
    'isEnabled',
    'isSystem',
    'name',
    'note',
  ],
};
