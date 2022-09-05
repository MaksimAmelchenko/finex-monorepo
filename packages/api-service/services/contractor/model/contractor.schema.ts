import { OpenAPIV3_1 } from 'openapi-types';

export const contractorSchema: OpenAPIV3_1.SchemaObject = {
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
      type: ['string', 'null'],
    },
  },
  additionalProperties: false,
  required: ['idProject', 'idUser', 'name'],
};
