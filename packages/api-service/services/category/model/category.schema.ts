import { OpenAPIV3_1 } from 'openapi-types';

export const categorySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    idCategoryPrototype: {
      type: ['number', 'null'],
    },
    parent: {
      type: ['number', 'null'],
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
    note: {
      type: ['string', 'null'],
    },
  },
  additionalProperties: false,
  required: [
    //
    'idProject',
    'idUser',
    'parent',
    'name',
    'isEnabled',
    'isSystem',
  ],
};
