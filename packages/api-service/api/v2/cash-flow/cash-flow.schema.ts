import { OpenAPIV3_1 } from 'openapi-types';

import { cashFlowItemSchema } from './cash-flow-item.schema';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';
import { userId } from '../../../common/schemas/fields/user-id';

export const cashFlowSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    contractorId: {
      ...contractorId,
      type: ['string', 'null'],
    },
    items: {
      type: 'array',
      items: cashFlowItemSchema,
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
