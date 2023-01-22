import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const createSubscriptionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    gateway: {
      type: 'string',
      enum: ['yookassa', 'paypal'],
    },
    planId: {
      type: 'string',
      enum: [
        //
        'monthlyRub',
        'annualRub',
        'monthlyEur',
        'annualEur',
      ],
    },
    locale,
  },
  additionalProperties: false,
  required: ['gateway', 'planId'],
};
