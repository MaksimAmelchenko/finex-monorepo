import { OpenAPIV3_1 } from 'openapi-types';

import { dateTime } from '../../../common/schemas/fields/date-time';
import { CashFlowType } from '../types';

export const cashFlowDaoSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    id: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    contractorId: {
      type: ['number', 'null'],
    },
    cashflowTypeId: {
      type: 'number',
      enum: [
        //
        CashFlowType.IncomeExpense,
        CashFlowType.Debt,
        CashFlowType.Transfer,
        CashFlowType.Exchange,
      ],
    },
    note: {
      type: ['string', 'null'],
    },
    tags: {
      type: ['array', 'null'],
      items: {
        type: 'number',
      },
    },
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'cashflowTypeId',
  ],
};
