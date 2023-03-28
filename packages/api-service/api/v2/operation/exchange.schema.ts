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

export const exchangeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    operationType: {
      type: 'string',
      enum: ['exchange'],
    },
    id,
    amountSell: {
      type: 'number',
    },
    moneySellId: moneyId,
    accountSellId: accountId,
    amountBuy: {
      type: 'number',
    },
    moneyBuyId: moneyId,
    accountBuyId: accountId,
    exchangeDate: date,
    reportPeriod: date,
    fee: {
      type: 'number',
    },
    moneyFeeId: moneyId,
    accountFeeId: accountId,
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    userId,
  },
  additionalProperties: false,
  required: [
    'operationType',
    'id',
    'amountSell',
    'moneySellId',
    'accountSellId',
    'amountBuy',
    'moneyBuyId',
    'accountBuyId',
    'exchangeDate',
    'reportPeriod',
    'fee',
    'moneyFeeId',
    'accountFeeId',
    'note',
    'tags',
    'userId',
  ],
};
