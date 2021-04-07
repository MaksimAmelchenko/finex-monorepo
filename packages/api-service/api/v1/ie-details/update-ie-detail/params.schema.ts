import { OpenAPIV3 } from 'openapi-types';
import { accountId } from '../../../../common/schemas/fields/account-id';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { moneyId } from '../../../../common/schemas/fields/money-id';
import { date } from '../../../../common/schemas/fields/date';
import { unitId } from '../../../../common/schemas/fields/unit-id';
import { ieDetailId } from '../../../../common/schemas/fields/ie-detail-id';
import { sign } from '../../../../common/schemas/fields/sign';
import { permit } from '../../../../common/schemas/fields/permit';

export const updateIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idIEDetail: ieDetailId,
    idAccount: accountId,
    idCategory: categoryId,
    idMoney: moneyId,
    idUnit: {
      ...unitId,
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
