import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const categoryPrototypeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id,
    parent: {
      ...id,
      nullable: true,
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['id', 'parent', 'name'],
};
