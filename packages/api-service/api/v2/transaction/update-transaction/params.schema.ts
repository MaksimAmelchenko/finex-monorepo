import { OpenAPIV3 } from 'openapi-types';

import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { date } from '../../../../common/schemas/fields/date';
import { id } from '../../../../common/schemas/fields/id';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { unitId } from '../../../../common/schemas/fields/unit-id';

export const updateTransactionParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    transactionId: id,
    sign,
    amount: {
      type: 'number',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      exclusiveMinimum: 0,
    },
    moneyId,
    accountId,
    categoryId,
    transactionDate: date,
    reportPeriod: date,
    quantity: {
      type: 'number',
      nullable: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      exclusiveMinimum: 0,
    },
    unitId: {
      ...unitId,
      nullable: true,
    },
    isNotConfirmed: {
      type: 'boolean',
      default: false,
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
  },
  additionalProperties: false,
  required: [
    //
    'transactionId',
  ],
};
