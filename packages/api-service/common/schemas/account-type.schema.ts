import { OpenAPIV3_1 } from 'openapi-types';

export const accountTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idAccountType: {
      type: 'integer',
      example: 8,
    },
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
  required: ['idAccountType', 'name', 'shortName'],
};

export const accountsTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: accountTypeSchema,
};
