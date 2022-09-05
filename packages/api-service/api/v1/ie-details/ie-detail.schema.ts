import { OpenAPIV3_1 } from 'openapi-types';

import { idAccount } from '../../../common/schemas/fields/id-account';
import { idMoney } from '../../../common/schemas/fields/id-money';
import { date } from '../../../common/schemas/fields/date';
import { idContractor } from '../../../common/schemas/fields/id-contractor';
import { idCategory } from '../../../common/schemas/fields/id-category';
import { idUnit } from '../../../common/schemas/fields/id-unit';
import { idPlan } from '../../../common/schemas/fields/id-plan';
import { idUser } from '../../../common/schemas/fields/id-user';
import { idIEDetail } from '../../../common/schemas/fields/id-ie-detail';
import { idIE } from '../../../common/schemas/fields/id-ie';
import { permit } from '../../../common/schemas/fields/permit';
import { sign } from '../../../common/schemas/fields/sign';

export const ieDetailSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser,
    idIEDetail,
    idIE,
    idContractor: {
      ...idContractor,
      type: ['integer', 'null'],
    },
    sign,
    dIEDetail: date,
    reportPeriod: date,
    idAccount,
    idCategory,
    quantity: {
      type: ['number', 'null'],
    },
    idUnit: {
      ...idUnit,
      type: ['integer', 'null'],
    },
    sum: {
      type: 'number',
    },
    idMoney,
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
      ...idPlan,
      type: ['integer', 'null'],
    },
    nRepeat: {
      type: ['integer', 'null'],
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
