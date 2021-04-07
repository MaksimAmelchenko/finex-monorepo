import { OpenAPIV3 } from 'openapi-types';

export const createAccountParamsSchema: OpenAPIV3.SchemaObject = {
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
      type: 'integer',
      nullable: true,
    },
    idUser: {
      type: 'integer',
      nullable: true,
    },
    //
  },

  additionalProperties: false,
  required: ['idAccountType', 'name', 'isEnabled', 'note'],
};
