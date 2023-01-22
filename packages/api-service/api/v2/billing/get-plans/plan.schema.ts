import { OpenAPIV3_1 } from 'openapi-types';

export const planSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    duration: {
      type: 'string',
    },
    price: {
      type: ['number', 'null'],
    },
    currency: {
      type: ['string', 'null'],
    },
    description: {
      type: 'string',
      description: 'Service name in invoice',
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
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'name',
    'price',
    'isEnabled',
    'isRenewable',
    'availablePaymentGateways',
    'paypalPlanId',
  ],
};
