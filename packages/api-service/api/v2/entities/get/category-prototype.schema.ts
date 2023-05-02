import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const categoryPrototypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    parent: {
      ...id,
      type: ['string', 'null'],
    },
    name: {
      type: 'string',
    },
    isEnabled: {
      type: 'boolean',
    },
    isSystem: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: ['id', 'parent', 'name', 'isEnabled', 'isSystem'],
};
