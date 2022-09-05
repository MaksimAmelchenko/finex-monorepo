import { OpenAPIV3_1 } from 'openapi-types';

import { projectId } from '../../../common/schemas/fields/project-id';
import { fileId } from '../../../common/schemas/fields/file-id';

export const fileSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId,
    id: fileId,
    name: {
      type: 'string',
      minLength: 1,
      example: 'ID.png',
    },
    contentType: {
      type: 'string',
      minLength: 1,
      example: 'image/png',
    },
    size: {
      type: 'integer',
      minLength: 1,
      description: 'Size in bytes',
      example: '194148',
    },
    metadata: {
      type: 'object',
      properties: {
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2017-05-21T21:58:18Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2017-06-12T23:02:41Z',
        },
      },
      required: ['createdAt'],
    },
  },
  required: ['projectId', 'id', 'name', 'contentType', 'size', 'metadata'],
  additionalProperties: false,
};
