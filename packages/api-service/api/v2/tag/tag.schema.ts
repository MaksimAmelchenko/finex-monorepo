import { OpenAPIV3 } from 'openapi-types';

import { tagId } from '../../../common/schemas/fields/tag-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const tagSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: tagId,
    name: {
      type: 'string',
    },
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'userId',
  ],
};
