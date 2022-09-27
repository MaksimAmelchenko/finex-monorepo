import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { date } from '../../../../common/schemas/fields/date';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const createPlanTransactionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    sign,
    amount: {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true,
    },
    moneyId,
    categoryId,
    accountId,
    contractorId: {
      ...contractorId,
      type: ['string', 'null'],
    },
    quantity: {
      type: ['number', 'null'],
      minimum: 0,
      exclusiveMinimum: true,
    },
    unitId: {
      ...unitId,
      type: ['string', 'null'],
    },

    startDate: date,
    reportPeriod: date,
    repetitionType: {
      type: 'number',
    },
    repetitionDays: {
      type: ['array', 'null'],
      items: {
        type: 'number',
      },
    },
    terminationType: {
      type: ['number', 'null'],
    },
    repetitionCount: {
      type: ['number', 'null'],
    },
    endDate: {
      type: ['string', 'null'],
      format: 'date',
    },
    note: {
      type: ['string', 'null'],
    },
    operationNote: {
      type: ['string', 'null'],
    },
    operationTags: {
      type: ['array', 'null'],
      items: {
        type: 'number',
      },
    },
    markerColor: {
      type: ['string', 'null'],
    },
  },
  additionalProperties: false,
  required: [
    //
    'sign',
    'amount',
    'moneyId',
    'accountId',
    'categoryId',
    'startDate',
    'reportPeriod',
    'repetitionType',
  ],
};
