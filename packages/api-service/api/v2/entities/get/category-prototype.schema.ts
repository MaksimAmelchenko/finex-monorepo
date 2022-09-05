import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const categoryPrototypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    parent: {
      ...id,
      type: ['integer', 'null'],
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['id', 'parent', 'name'],
};
