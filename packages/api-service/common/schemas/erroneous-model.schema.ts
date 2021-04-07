import { projectId } from './fields/project-id';

export default {
  type: 'object',
  properties: {
    projectId,
    id: {
      type: 'number',
      example: '12345',
    },
    metadata: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              example: 'notFound',
            },
            status: {
              type: 'integer',
              example: '404',
            },
            message: {
              type: 'string',
              example: '[Model] not found',
            },
          },
        },
      },
      required: ['error'],
      additionalProperties: false,
    },
  },
  required: ['projectId', 'id', 'metadata'],
  additionalProperties: false,
};
