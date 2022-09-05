import { OpenAPIV3_1 } from 'openapi-types';

export const projectSchema: OpenAPIV3_1.SchemaObject = {
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
      type: ['string', 'null'],
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
