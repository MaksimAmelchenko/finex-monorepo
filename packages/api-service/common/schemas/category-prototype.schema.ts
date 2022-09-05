import { OpenAPIV3_1 } from 'openapi-types';

export const categoryPrototypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategoryPrototype: {
      type: 'integer',
      example: 30,
    },
    parent: {
      type: ['integer', 'null'],
    },
    name: {
      type: 'string',
      example: 'Продукты',
    },
  },
  additionalProperties: false,
  required: ['idCategoryPrototype', 'parent', 'name'],
};
