import { OpenAPIV3_1 } from 'openapi-types';
import { userId } from './fields/user-id';

export const unitSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idUnit: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idUser', 'idUnit', 'name'],
};
