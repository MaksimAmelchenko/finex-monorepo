import { OpenAPIV3_1 } from 'openapi-types';

export const tagDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'number',
    },
    idUnit: {
      type: 'number',
    },
    idUser: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idProject', 'idUser', 'name'],
};
