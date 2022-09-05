import { OpenAPIV3_1 } from 'openapi-types';

import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idCategory } from '../../../../common/schemas/fields/id-category';
import { idUser } from '../../../../common/schemas/fields/id-user';

export const createCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategoryPrototype: {
      type: ['integer', 'null'],
    },
    idUnit,
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
      ...idCategory,
      type: ['integer', 'null'],
    },
    // frontend sends this
    chosen: {
      type: 'boolean',
    },

    idCategory: {
      ...idCategory,
      type: ['integer', 'null'],
    },
    idUser: {
      ...idUser,
      type: ['integer', 'null'],
    },
    //
  },

  additionalProperties: false,
  required: ['parent', 'name', 'isEnabled', 'note'],
};
