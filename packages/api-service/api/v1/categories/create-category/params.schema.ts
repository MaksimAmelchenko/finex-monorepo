import { OpenAPIV3 } from 'openapi-types';

import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idCategory } from '../../../../common/schemas/fields/id-category';
import { idUser } from '../../../../common/schemas/fields/id-user';

export const createCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategoryPrototype: {
      type: 'integer',
      nullable: true,
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
      nullable: true,
    },
    // frontend sends this
    chosen: {
      type: 'boolean',
    },

    idCategory: {
      ...idCategory,
      nullable: true,
    },
    idUser: {
      ...idUser,
      nullable: true,
    },
    //
  },

  additionalProperties: false,
  required: ['parent', 'name', 'isEnabled', 'note'],
};
