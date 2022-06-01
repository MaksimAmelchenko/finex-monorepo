import { OpenAPIV3 } from 'openapi-types';

import { tagId } from '../../../../common/schemas/fields/tag-id';

export const updateTagParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    tagId,
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['tagId'],
};
