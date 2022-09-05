import { OpenAPIV3_1 } from 'openapi-types';

export const createAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idAccountType: {
      type: 'integer',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    isEnabled: {
      type: 'boolean',
    },
    note: {
      type: 'string',
    },
    readers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    writers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    // frontend sends this
    chosen: {
      type: 'boolean',
    },
    idAccount: {
      type: ['integer', 'null'],
    },
    idUser: {
      type: ['integer', 'null'],
    },
    //
  },

  additionalProperties: false,
  required: ['idAccountType', 'name', 'isEnabled', 'note'],
};
