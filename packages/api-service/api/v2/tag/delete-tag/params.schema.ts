import { OpenAPIV3_1 } from 'openapi-types';

import { tagId } from '../../../../common/schemas/fields/tag-id';

export const deleteTagParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    tagId,
  },
  additionalProperties: false,
  required: ['tagId'],
};
