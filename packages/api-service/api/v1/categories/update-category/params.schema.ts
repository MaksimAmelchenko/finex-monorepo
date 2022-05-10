import { OpenAPIV3 } from 'openapi-types';

import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idCategory } from '../../../../common/schemas/fields/id-category';

export const updateCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategory,
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
  },

  additionalProperties: false,
  required: ['idCategory'],
};
