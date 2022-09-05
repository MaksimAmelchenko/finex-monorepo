import { OpenAPIV3_1 } from 'openapi-types';

export const accountSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    idAccountType: {
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
    isEnabled: {
      type: 'boolean',
    },
    viewers: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    editors: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  additionalProperties: false,
  required: [
    //
    'idProject',
    'idUser',
    'idAccountType',
    'name',
    'isEnabled',
  ],
};
