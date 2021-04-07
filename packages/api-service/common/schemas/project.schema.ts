import { OpenAPIV3 } from 'openapi-types';
import { projectId } from './fields/project-id';
import { userId } from './fields/user-id';
import { permit } from './fields/permit';

export const projectSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idProject: projectId,
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
