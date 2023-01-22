import { OpenAPIV3_1 } from 'openapi-types';

import { dateTime } from '../../../../common/schemas/fields/date-time';
import { i18n } from '../../../../common/schemas/fields/i18n';
import { id } from '../../../../common/schemas/fields/id';

export const planDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id,
    name: i18n({ type: 'string' }),
    description: i18n({ type: 'string' }),
    productName: i18n(
      { type: 'string' },
      {
        override: {
          description: 'Service name in an invoice',
        },
      }
    ),
    duration: {
      type: ['string'],
    },
    price: {
      type: ['number', 'null'],
    },
    currency: {
      type: ['string', 'null'],
    },
    isEnabled: {
      type: 'boolean',
    },
    isRenewable: {
      type: 'boolean',
    },
    availablePaymentGateways: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['yookassa', 'paypal'],
      },
    },
    paypalPlanId: {
      type: ['string', 'null'],
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'productName',
    'price',
    'isEnabled',
    'isRenewable',
    'availablePaymentGateways',
  ],
};
