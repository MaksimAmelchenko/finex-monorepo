import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../common/schemas/fields/id';

export const accountTypeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id,
    name: {
      type: 'string',
      example: 'Электронные деньги',
    },
    shortName: {
      type: 'string',
      example: 'Электронные деньги',
    },
  },
  additionalProperties: false,
  required: ['id', 'name', 'shortName'],
};

export const accountsTypeSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: accountTypeSchema,
};
