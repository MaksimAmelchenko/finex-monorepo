import { OpenAPIV3_1 } from 'openapi-types';

import { idUser } from './fields/id-user';
import { idCategory } from './fields/id-category';
import { idUnit } from './fields/id-unit';

export const categorySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idCategory,
    parent: {
      ...idCategory,
      type: ['integer', 'null'],
    },
    idCategoryPrototype: {
      type: ['integer', 'null'],
    },
    idUnit: {
      ...idUnit,
      type: ['integer', 'null'],
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
