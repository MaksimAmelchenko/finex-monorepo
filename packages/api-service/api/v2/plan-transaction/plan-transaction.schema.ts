import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../common/schemas/fields/account-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { date } from '../../../common/schemas/fields/date';
import { id } from '../../../common/schemas/fields/id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { userId } from '../../../common/schemas/fields/user-id';

export const planTransactionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    planId: id,
    sign,
    amount: {
      type: 'number',
      exclusiveMinimum: 0,
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
      exclusiveMinimum: 0,
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
      minLength: 1,
    },
    userId,
    permit,
  },
  additionalProperties: false,
  required: [
    //
    'planId',
    'sign',
    'amount',
    'moneyId',
    'categoryId',
    'accountId',
    'startDate',
    'reportPeriod',
    'repetitionType',
    'repetitionDays',
    'terminationType',
    'repetitionCount',
    'endDate',
    'note',
    'operationNote',
    'operationTags',
    'markerColor',
    'userId',
    'permit',
  ],
};
