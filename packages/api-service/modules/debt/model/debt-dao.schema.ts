import { OpenAPIV3 } from 'openapi-types';

import { dateTime } from '../../../common/schemas/fields/date-time';

export const debtDAOSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    id: {
      type: 'number',
    },
    contractorId: {
      type: 'number',
    },
    note: {
      type: 'string',
      nullable: true,
    },
    tags: {
      type: 'array',
      items: {
        type: 'number',
      },
      nullable: true,
    },
    updatedAt: dateTime,
    cashflowTypeId: {
      type: 'number',
      enum: [2],
    },
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'contractorId',
    'cashflowTypeId',
  ],
};
