import { OpenAPIV3_1 } from 'openapi-types';

import { idProject } from './fields/id-project';
import { idUser } from './fields/id-user';
import { permit } from './fields/permit';

export const projectSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idProject,
    name: {
      type: 'string',
      example: 'Моя бухгалтерия',
    },
    note: {
      type: 'string',
    },
    permit,
    writers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
  },
  additionalProperties: false,
  required: ['idUser', 'idProject', 'name', 'note', 'permit', 'writers'],
};
