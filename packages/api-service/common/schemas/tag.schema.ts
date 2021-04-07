import { OpenAPIV3 } from 'openapi-types';
import { userId } from './fields/user-id';

export const tagSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idTag: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idUser', 'idTag', 'name'],
};
