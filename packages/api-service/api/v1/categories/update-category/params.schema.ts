import { OpenAPIV3_1 } from 'openapi-types';

import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idCategory } from '../../../../common/schemas/fields/id-category';

export const updateCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategory,
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
  },

  additionalProperties: false,
  required: ['idCategory'],
};
