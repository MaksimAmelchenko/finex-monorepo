import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const contractorSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: contractorId,
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'note',
    'userId',
  ],
};
