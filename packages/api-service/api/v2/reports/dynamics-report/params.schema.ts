import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../../common/schemas/fields/date';
import { locale } from '../../../../common/schemas/fields/locale';

export const getDynamicsReportParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    startDate: date,
    endDate: date,
    isUseReportPeriod: {
      type: 'boolean',
    },
    moneyId: {
      type: ['string', 'null'],
    },
    contractorsUsingType: {
      type: 'integer',
      enum: [1, 2],
    },
    contractors: {
      type: 'string',
      example: '1,2,3',
    },
    accountsUsingType: {
      type: 'integer',
      enum: [1, 2],
    },
    accounts: {
      type: 'string',
      example: '1,2,3',
    },
    categoriesUsingType: {
      type: 'integer',
      enum: [1, 2],
    },
    categories: {
      type: 'string',
      example: '1,2,3',
    },
    tagsUsingType: {
      type: 'integer',
      enum: [1, 2],
    },
    tags: {
      type: 'string',
      example: '1,2,3',
    },
    isUsePlan: {
      type: 'boolean',
    },
    locale,
  },
  additionalProperties: false,
  required: [
    //
    'startDate',
    'endDate',
    'moneyId',
  ],
};
