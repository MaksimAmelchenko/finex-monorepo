import { OpenAPIV3_1 } from 'openapi-types';
import { userId } from './fields/user-id';

export const contractorSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idContractor: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idUser', 'idContractor', 'name', 'note'],
};
