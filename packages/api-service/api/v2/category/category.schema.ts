import { OpenAPIV3 } from 'openapi-types';

import { categoryId } from '../../../common/schemas/fields/category-id';
import { id } from '../../../common/schemas/fields/id';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const categorySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: categoryId,
    name: {
      type: 'string',
    },
    parent: {
      ...id,
      nullable: true,
    },
    categoryPrototypeId: {
      ...id,
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
    },
    note: {
      type: 'string',
    },
    isSystem: {
      type: 'boolean',
    },
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'parent',
    'categoryPrototypeId',
    'isEnabled',
    'note',
    'isSystem',
    'userId',
  ],
};
