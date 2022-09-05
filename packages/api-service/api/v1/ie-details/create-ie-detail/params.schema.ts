import { OpenAPIV3_1 } from 'openapi-types';

import { idAccount } from '../../../../common/schemas/fields/id-account';
import { idCategory } from '../../../../common/schemas/fields/id-category';
import { idMoney } from '../../../../common/schemas/fields/id-money';
import { date } from '../../../../common/schemas/fields/date';
import { idContractor } from '../../../../common/schemas/fields/id-contractor';
import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idPlan } from '../../../../common/schemas/fields/id-plan';
import { permit } from '../../../../common/schemas/fields/permit';

export const createIeDetailParamsSchema: OpenAPIV3_1.SchemaObject = {
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
      type: ['integer', 'null'],
    },
    idContractor: {
      ...idContractor,
      type: ['integer', 'null'],
    },
    idUnit: {
      ...idUnit,
      type: ['integer', 'null'],
    },
    sum: {
      type: 'number',
    },
    isNotConfirmed: {
      type: ['boolean', 'null'],
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
      type: ['integer', 'null'],
    },
    // frontend sends these fields
    idUser: {
      type: ['integer', 'null'],
    },
    idIE: {
      type: ['integer', 'null'],
    },
    idIEDetail: {
      type: ['integer', 'null'],
    },
    permit: {
      ...permit,
      enum: [...permit.enum!, null],
      type: ['integer', 'null'],
    },
    nRepeat: {
      type: ['integer', 'null'],
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
