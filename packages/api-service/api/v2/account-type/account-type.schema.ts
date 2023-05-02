import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';

export const accountTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    name: {
      type: 'string',
      example: 'Электронные деньги',
    },
  },
  additionalProperties: false,
  required: ['id', 'name'],
};

export const accountsTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: accountTypeSchema,
};
