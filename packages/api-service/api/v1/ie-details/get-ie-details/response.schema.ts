import { OpenAPIV3_1 } from 'openapi-types';

import { ieDetailSchema } from '../ie-detail.schema';

export const getIeDetailsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    ieDetails: {
      type: 'array',
      items: ieDetailSchema,
    },
    metadata: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
        },
        offset: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
        totalPlanned: {
          type: 'integer',
        },
      },
    },
  },
  additionalProperties: false,
  required: ['ieDetails', 'metadata'],
};
