import { OpenAPIV3 } from 'openapi-types';

export const categoryPrototypeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategoryPrototype: {
      type: 'integer',
      example: 30,
    },
    parent: {
      type: 'integer',
      nullable: true,
    },
    name: {
      type: 'string',
      example: 'Продукты',
    },
  },
  additionalProperties: false,
  required: ['idCategoryPrototype', 'parent', 'name'],
};
