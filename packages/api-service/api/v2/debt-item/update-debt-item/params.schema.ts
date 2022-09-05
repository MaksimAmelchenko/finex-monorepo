import { OpenAPIV3_1 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { sign } from '../../../../common/schemas/fields/sign';

export const updateDebtItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
    debtItemId: id,
    sign,
    amount: {
      type: 'number',
    },
    moneyId,
    accountId,
    categoryId,
    debtItemDate: date,
    reportPeriod: date,
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: ['debtItemId'],
};
