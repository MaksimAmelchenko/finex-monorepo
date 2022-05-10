import { OpenAPIV3 } from 'openapi-types';

import { idUser } from './fields/id-user';
import { idCategory } from './fields/id-category';
import { idUnit } from './fields/id-unit';

export const categorySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idCategory,
    parent: {
      ...idCategory,
      nullable: true,
    },
    idCategoryPrototype: {
      type: 'integer',
      nullable: true,
    },
    idUnit: {
      ...idUnit,
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
