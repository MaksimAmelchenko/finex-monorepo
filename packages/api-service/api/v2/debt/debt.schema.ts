import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { debtItemSchema } from './debt-item.schema';
import { id } from '../../../common/schemas/fields/id';
import { userId } from '../../../common/schemas/fields/user-id';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { date } from '../../../common/schemas/fields/date';

export const debtSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    contractorId,
    items: {
      type: 'array',
      items: debtItemSchema,
    },
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    updatedAt: dateTime,
    userId,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'contractorId',
    'note',
    'tags',
    'items',
    'updatedAt',
    'userId',
  ],
};
