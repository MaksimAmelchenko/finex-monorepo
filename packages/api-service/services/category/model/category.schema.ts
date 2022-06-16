import { OpenAPIV3 } from 'openapi-types';

export const categorySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    idCategoryPrototype: {
      type: 'number',
      nullable: true,
    },
    parent: {
      type: 'number',
      nullable: true,
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
      type: 'string',
      nullable: true,
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
