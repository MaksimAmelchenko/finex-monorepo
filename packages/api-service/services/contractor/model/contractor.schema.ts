import { OpenAPIV3 } from 'openapi-types';

export const contractorSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idContractor: {
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
  },
  additionalProperties: false,
  required: ['idProject', 'idUser', 'name'],
};
