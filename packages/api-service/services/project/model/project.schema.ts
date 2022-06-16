import { OpenAPIV3 } from 'openapi-types';

export const projectSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
      nullable: true,
    },
    permit: {
      type: 'number',
    },
    editors: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  additionalProperties: false,
  required: ['idUser', 'name'],
};
