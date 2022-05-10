import { OpenAPIV3 } from 'openapi-types';

import { idAccount } from '../../../../common/schemas/fields/id-account';
import { idCategory } from '../../../../common/schemas/fields/id-category';
import { idMoney } from '../../../../common/schemas/fields/id-money';
import { date } from '../../../../common/schemas/fields/date';
import { idContractor } from '../../../../common/schemas/fields/id-contractor';
import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idPlan } from '../../../../common/schemas/fields/id-plan';
import { permit } from '../../../../common/schemas/fields/permit';

export const createIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idAccount,
    idCategory,
    idMoney,
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
      ...idContractor,
      nullable: true,
    },
    idUnit: {
      ...idUnit,
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
      ...idPlan,
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
