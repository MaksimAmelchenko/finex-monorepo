import { OpenAPIV3 } from 'openapi-types';

import { idAccount } from '../../../../common/schemas/fields/id-account';
import { idCategory } from '../../../../common/schemas/fields/id-category';
import { idMoney } from '../../../../common/schemas/fields/id-money';
import { date } from '../../../../common/schemas/fields/date';
import { idUnit } from '../../../../common/schemas/fields/id-unit';
import { idIEDetail } from '../../../../common/schemas/fields/id-ie-detail';
import { sign } from '../../../../common/schemas/fields/sign';
import { permit } from '../../../../common/schemas/fields/permit';

export const updateIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idIEDetail,
    idAccount,
    idCategory,
    idMoney,
    idUnit: {
      ...idUnit,
      nullable: true,
    },
    sign,
    dIEDetail: date,
    reportPeriod: date,
    quantity: {
      type: 'integer',
      nullable: true,
    },
    sum: {
      type: 'number',
    },
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
    // frontend sends these fields
    idUser: {
      type: 'integer',
    },
    idIE: {
      type: 'integer',
      nullable: true,
    },
    permit,
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
  required: ['idIEDetail'],
};
