import { OpenAPIV3 } from 'openapi-types';
import { accountId } from '../../../common/schemas/fields/account-id';
import { moneyId } from '../../../common/schemas/fields/money-id';
import { date } from '../../../common/schemas/fields/date';
import { contractorId } from '../../../common/schemas/fields/contractor-id';
import { categoryId } from '../../../common/schemas/fields/category-id';
import { unitId } from '../../../common/schemas/fields/unit-id';
import { planId } from '../../../common/schemas/fields/plan-id';
import { userId } from '../../../common/schemas/fields/user-id';
import { ieDetailId } from '../../../common/schemas/fields/ie-detail-id';
import { ieId } from '../../../common/schemas/fields/ie-id';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';

export const ieDetailSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idUser: userId,
    idIEDetail: ieDetailId,
    idIE: ieId,
    idContractor: {
      ...contractorId,
      nullable: true,
    },
    sign,
    dIEDetail: date,
    reportPeriod: date,
    idAccount: accountId,
    idCategory: categoryId,
    quantity: {
      type: 'number',
      nullable: true,
    },
    idUnit: {
      ...unitId,
      nullable: true,
    },
    sum: {
      type: 'number',
    },
    idMoney: moneyId,
    isNotConfirmed: {
      type: 'boolean',
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
    permit,
    idPlan: {
      ...planId,
      nullable: true,
    },
    nRepeat: {
      type: 'integer',
      nullable: true,
    },
    colorMark: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    'idUser',
    'idIEDetail',
    'idIE',
    'idContractor',
    'sign',
    'dIEDetail',
    'reportPeriod',
    'idAccount',
    'idCategory',
    'quantity',
    'idUnit',
    'sum',
    'idMoney',
    'isNotConfirmed',
    'note',
    'tags',
    'permit',
    'nRepeat',
    'colorMark',
  ],
};
