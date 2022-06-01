import { OpenAPIV3 } from 'openapi-types';

import { tagId } from '../../../../common/schemas/fields/tag-id';

export const deleteTagParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    tagId,
  },
  additionalProperties: false,
  required: ['tagId'],
};
