import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../common/schemas/fields/date';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';

export const transactionDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'integer',
    },
    providerTransactionId: id,
    userId: {
      type: 'integer',
    },
    cashFlowId: {
      type: ['integer', 'null'],
    },
    amount: {
      type: 'number',
    },
    currency: {
      type: 'string',
    },
    transactionDate: date,
    transformationName: {
      type: 'string',
    },
    source: {
      type: 'object',
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },

  additionalProperties: false,
  required: [
    //
    'projectId',
    'providerTransactionId',
    'userId',
    'amount',
    'currency',
    'transactionDate',
    'transformationName',
    'source',
  ],
};
