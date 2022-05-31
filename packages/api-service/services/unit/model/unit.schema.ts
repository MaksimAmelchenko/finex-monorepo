import { OpenAPIV3 } from 'openapi-types';

export const unitSchema: OpenAPIV3.SchemaObject = {
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
