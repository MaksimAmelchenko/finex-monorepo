import { OpenAPIV3_1 } from 'openapi-types';

import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const unitSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: unitId,
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
