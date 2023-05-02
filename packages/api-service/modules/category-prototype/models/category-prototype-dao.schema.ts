import { OpenAPIV3_1 } from 'openapi-types';

import { i18n } from '../../../common/schemas/fields/i18n';
import { id } from '../../../common/schemas/fields/id';

export const categoryPrototypeDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategoryPrototype: id,
    parent: {
      type: ['number', 'null'],
    },
    name: i18n({ type: 'string' }),
    isEnabled: {
      type: 'boolean',
    },
    isSystem: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idCategoryPrototype',
    'name',
    'isEnabled',
    'isSystem',
  ],
};
