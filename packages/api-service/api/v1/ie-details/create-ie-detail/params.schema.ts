import { OpenAPIV3 } from 'openapi-types';
import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { date } from '../../../../common/schemas/fields/date';
import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { unitId } from '../../../../common/schemas/fields/unit-id';
import { planId } from '../../../../common/schemas/fields/plan-id';
import { permit } from '../../../../common/schemas/fields/permit';

export const createIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount: accountId,
    idCategory: categoryId,
    idMoney: moneyId,
    sign: {
      type: 'integer',
      enum: [1, -1],
    },
    dIEDetail: date,
    reportPeriod: date,
    quantity: {
      type: 'integer',
      nullable: true,
    },
    idContractor: {
      ...contractorId,
      nullable: true,
    },
    idUnit: {
      ...unitId,
      nullable: true,
    },
    sum: {
      type: 'number',
    },
    isNotConfirmed: {
      type: 'boolean',
      nullable: true,
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
    idPlan: {
      ...planId,
      nullable: true,
    },
    // frontend sends these fields
    idUser: {
      type: 'integer',
      nullable: true,
    },
    idIE: {
      type: 'integer',
      nullable: true,
    },
    idIEDetail: {
      type: 'integer',
      nullable: true,
    },
    permit: {
      ...permit,
      enum: [...permit.enum!, null],
      nullable: true,
    },
    nRepeat: {
      type: 'integer',
      nullable: true,
    },
    chosen: {
      type: 'boolean',
    },
    colorMark: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idAccount',
    'idCategory',
    'idMoney',
    'sign',
    'sum',
    'dIEDetail',
    'reportPeriod',
  ],
};
